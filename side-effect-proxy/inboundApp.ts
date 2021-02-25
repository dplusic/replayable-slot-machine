import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import * as httpProxy from "http-proxy";
import { Recorder } from "./recorder";
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
    
    ioRecord.response.body = '';
    
    const oldWrite = res.end;
    res.write = function (data: Buffer) {
      ioRecord.response.body += data.toString();
      return oldWrite.apply(res, arguments);
    }
    
    res.on('finish', () => {
      ioRecord.response.statusCode = res.statusCode;
      ioRecord.response.statusMessage = res.statusMessage;
      
      recorder.dumpAndRemove(seId);
    });
    
    proxy.web(req, res, {
      target: 'http://localhost:10003',
      headers: additionalHeaders,
    });
  });
  
  app.listen(10001);
};
