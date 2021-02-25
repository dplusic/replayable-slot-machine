import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import * as httpProxy from "http-proxy";

export const start = () => {
  const proxy = httpProxy.createProxyServer();
  
  const app = express();
  
  app.use('/', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:10003',
      headers: {
        'x-side-effect-transaction-id': uuidv4(),
      }
    });
  });
  
  app.listen(10001);
};
