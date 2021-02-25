import * as httpProxy from "http-proxy";
import * as express from "express";
import { router as extRouter } from "./extRouter";


export const start = () => {
  const proxy = httpProxy.createProxyServer();
  
  const app = express();
  
  app.use('/', (req, res, next) => {
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
