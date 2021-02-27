import express from "express";
import { AsyncLocalStorage } from "async_hooks";
import fetch, * as Fetch from "node-fetch";
import { headersArrayFromHeadersInit, headersArrayFromIncomingHttpHeaders } from "./util";

const HttpProxyAgent = require('http-proxy-agent');

type AsyncStorage = {
  req: express.Request,
}

const asyncLocalStorage = new AsyncLocalStorage<AsyncStorage>();

export const proxyMiddleware = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  asyncLocalStorage.run(
    {
      req,
    },
    next,
  );
}

export const fetchThroughProxy = (url: string, init?: Fetch.RequestInit): Promise<Fetch.Response> => {
  const asyncStorage = asyncLocalStorage.getStore();
  
  let reqHeaders: string[][];
  if (!asyncStorage) {
    console.warn("no async storage");
    reqHeaders = [];
  } else {
    reqHeaders = headersArrayFromIncomingHttpHeaders(asyncStorage.req.headers)
      .filter(([k]) => k.startsWith('x-'));
  }
  
  let headers: string[][];
  if (init && init.headers) {
    init.headers
    headers = [...headersArrayFromHeadersInit(init.headers), ...reqHeaders]
  } else {
    headers = reqHeaders;
  }
  
  return fetch(url, {
    ...init,
    agent: new HttpProxyAgent('http://localhost:10002'),
    headers,
  });
}
