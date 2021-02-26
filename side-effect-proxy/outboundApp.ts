import * as httpProxy from "http-proxy";
import * as express from "express";
import { router as extRouter } from "./extRouter";
import { Recorder, recordResponse } from "./recorder";
import { createSideEffectRecord } from "./record";

export const start = ({
  recorder
}: {
  recorder: Recorder
}) => {
  const proxy = httpProxy.createProxyServer();
  
  const app = express();
  
  app.use('/', (req, res, next) => {
    
    const seId = req.headers['x-side-effect-id'] as string;
    const ioRecord = recorder.get(seId);
    
    const sideEffectRecord = createSideEffectRecord({
      url: req.url,
    });
    ioRecord.sideEffects.push(sideEffectRecord);
    recordResponse(sideEffectRecord.response, res);
    
    if (req.hostname.startsWith('side-effect-proxy-ext')) {
      return extRouter(req, res, next);
    } else {
      proxy.web(req, res, {
        target: req.url,
      });
    }
  });
  
  app.listen(10002);
};
