import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import * as httpProxy from "http-proxy";
import { Recorder, recordResponse } from "./recorder";
import { createIORecord } from "./record";
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
  
  app.use('/', (req, res) => {
    const seId = uuidv4();
    
    const additionalHeaders = {
      [config.sideEffectIdHeaderKey]: seId,
    };
    
    const ioRecord = createIORecord({
      url: req.url,
    });
    
    recorder.add(seId, ioRecord);
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
