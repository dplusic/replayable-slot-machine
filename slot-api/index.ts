import * as express from 'express';

const HttpProxyAgent = require('http-proxy-agent');
const fetch = require('node-fetch');

const app = express();

app.get('/pull', (req, res) => {
  
  fetch('http://side-effect-proxy-random', {
    agent: new HttpProxyAgent('http://localhost:10002'),
    headers: Object.entries(req.headers).filter(([k]) => k.startsWith('x-')),
  })
    .then(res => res.json())
    .then(json => {
      res.json({
        'rand': json.random,
        'result': ['7️', '🌿', '🐞'],
      })
    });
});

app.listen(10003);
