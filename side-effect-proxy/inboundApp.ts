import express from "express";
import { v4 as uuidv4 } from "uuid";
import httpProxy from "http-proxy";
import { Recorder, recordRequest, recordResponse } from "./recorder";
import { createIORecord } from "./record";
import { Config } from "./config";
import bodyParser from "body-parser";

export const start = ({
  config,
  recorder,
}: {
  config: Config,
  recorder: Recorder,
}) => {
  const proxy = httpProxy.createProxyServer();
  
  const app = express();
  app.use(bodyParser.text());
  
  app.use('/', (req, res) => {
    const seId = uuidv4();
    
    const additionalHeaders = {
      [config.sideEffectIdHeaderKey]: seId,
    };
    
    const ioRecord = createIORecord({
      url: req.url,
      body: req.body,
    });
    
    recorder.add(seId, ioRecord);
    recordRequest(ioRecord.request, req);
    recordResponse(ioRecord.response, res, () => {
      recorder.finish(seId);
    });
    
    proxy.web(req, res, {
      target: config.appTarget,
      headers: additionalHeaders,
    });
  });
  
  app.listen(config.inboundPort);
};
