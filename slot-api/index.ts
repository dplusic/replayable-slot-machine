import * as express from 'express';
import { WeightInfo } from 'common/weight';

const HttpProxyAgent = require('http-proxy-agent');
const fetch = require('node-fetch');

const app = express();

type SideEffectProxyExtRes = {
  date: number,
  randoms: number[],
}

const fetchWithProxy = (url: string, headers: {}) =>
  fetch(url, {
    agent: new HttpProxyAgent('http://localhost:10002'),
    headers: Object.entries(headers).filter(([k]) => k.startsWith('x-')),
  })

const fetchSideEffectProxyExt = (headers: {}): Promise<SideEffectProxyExtRes> =>
  fetchWithProxy('http://side-effect-proxy-ext', headers)
    .then(res => res.json())

const fetchWeightInfos = (headers: {}): Promise<WeightInfo[]> =>
  fetchWithProxy('http://localhost:10004/weights', headers)
    .then(res => res.json())

const pull = (weightInfos: WeightInfo[], randoms: number[]) => {
  const totalWeight = weightInfos.reduce((pre, cur) => pre + cur.weight, 0);
  const ps = weightInfos.map(({ emoji, weight }) => ({
    emoji,
    p: weight / totalWeight
  }));
  const pAccs = ps.slice(1)
    .reduce((pre, cur) => (
      [...pre, {
        emoji: cur.emoji,
        p: pre[pre.length - 1].p + cur.p
      }]
    ), [ps[0]]);
  return randoms
    .map(random => pAccs.reduce((pre, cur) => random < pre.p ? pre : cur))
    .map(({ emoji }) => emoji)
};

app.get('/pull', (req, res, next) => {
  
  Promise.all([
    fetchSideEffectProxyExt(req.headers),
    fetchWeightInfos(req.headers),
  ])
    .then(([sideEffectProxyExtRes, weightInfos]: [SideEffectProxyExtRes, WeightInfo[]]) => {
      res.json({
        'date': new Date(sideEffectProxyExtRes.date).toISOString(),
        'result': pull(weightInfos, sideEffectProxyExtRes.randoms),
      })
    })
    .catch(next)
});

app.listen(10003);
