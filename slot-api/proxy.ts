import express from "express";
import { AsyncLocalStorage } from "async_hooks";
import fetch, * as Fetch from "node-fetch";
import { headersArrayFromIncomingHttpHeaders } from "./util";

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

export const fetchThroughProxy = (url: string): Promise<Fetch.Response> => {
  const asyncStorage = asyncLocalStorage.getStore();
  
  let headers: string[][];
  if (!asyncStorage) {
    console.warn("no async storage");
    headers = [];
  } else {
    headers = headersArrayFromIncomingHttpHeaders(asyncStorage.req.headers)
      .filter(([k]) => k.startsWith('x-'));
  }
  
  return fetch(url, {
    agent: new HttpProxyAgent('http://localhost:10002'),
    headers,
  });
}
