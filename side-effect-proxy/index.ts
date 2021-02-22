import * as express from 'express';
import * as httpProxy from 'http-proxy'
import { v4 as uuidv4 } from 'uuid';

const proxy = httpProxy.createProxyServer();

const inboundApp = express();

inboundApp.use('/', (req, res) => {
  proxy.web(req, res, {
    target: 'http://localhost:10003',
    headers: {
      'x-side-effect-transaction-id': uuidv4(),
    }
  });
});

inboundApp.listen(10001);


const outboundApp = express();

outboundApp.use('/', (req, res) => {
  if (req.host === 'side-effect-proxy-random') {
    res.json({
      random: Math.random(),
    })
  } else {
    proxy.web(req, res, {
      target: req.url,
    }); 
  }
});

outboundApp.listen(10002);
