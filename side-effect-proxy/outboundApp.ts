import httpProxy from "http-proxy";
import express from "express";
import { router as extRouter } from "./extRouter";
import { Recorder, recordRequest, recordResponse } from "./recorder";
import { createSideEffectRecord } from "./record";
import { Config } from "./config";

export const start = ({
  config,
  recorder,
}: {
  config: Config,
  recorder: Recorder,
}) => {
  const proxy = httpProxy.createProxyServer();
  
  const app = express();
  
  app.use('/', (req, res, next) => {
    
    const seId = req.headers[config.sideEffectIdHeaderKey] as string;
    const ioRecord = recorder.get(seId);
    
    const sideEffectRecord = createSideEffectRecord({
      url: req.url,
      body: req.body,
    });
    ioRecord.sideEffects.push(sideEffectRecord);
    recordRequest(sideEffectRecord.request, req);
    recordResponse(sideEffectRecord.response, res);
    
    if (req.hostname.startsWith('side-effect-proxy-ext')) {
      return extRouter(req, res, next);
    } else {
      proxy.web(req, res, {
        target: req.url.substring(0, req.url.indexOf('/', 8)),
      });
    }
  });
  
  app.listen(config.outboundPort);
};
