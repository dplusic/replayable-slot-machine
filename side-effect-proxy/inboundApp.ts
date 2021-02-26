import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import * as httpProxy from "http-proxy";
import { Recorder, recordResponse } from "./recorder";
import { createIORecord } from "./record";

export const start = ({
  recorder
}: {
  recorder: Recorder
}) => {
  const proxy = httpProxy.createProxyServer();
  
  const app = express();
  
  app.use('/', (req, res) => {
    const seId = uuidv4();
    
    const additionalHeaders = {
      'x-side-effect-id': seId,
    };
    
    const ioRecord = createIORecord({
      url: req.url,
    });
    
    recorder.add(seId, ioRecord);
    recordResponse(ioRecord.response, res, () => {
      recorder.dumpAndRemove(seId);
    });
    
    proxy.web(req, res, {
      target: 'http://localhost:10003',
      headers: additionalHeaders,
    });
  });
  
  app.listen(10001);
};
