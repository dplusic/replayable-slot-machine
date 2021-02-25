import * as express from 'express';

const HttpProxyAgent = require('http-proxy-agent');
const fetch = require('node-fetch');

const app = express();

type WeightInfo = {
  emoji: string;
  weight: number;
}

const WEIGHT_INFOS: WeightInfo[] = [
  {
    emoji: '7️',
    weight: 1,
  },
  {
    emoji: '🌿',
    weight: 5,
  },
  {
    emoji: '🐞',
    weight: 10,
  },
];

type SideEffectProxyExtRes = {
  date: number,
  randoms: number[],
}

const pull = (weightInfos: WeightInfo[], randoms: number[]) => {
  const totalWeight = weightInfos.reduce((pre, cur) => pre + cur.weight, 0);
  const ps = weightInfos.map(({ emoji, weight }) => ({
    emoji,
    p: weight / totalWeight
  }));
  const pAccs = ps
    .reduce((pre, cur) => (
      [...pre, {
        emoji: cur.emoji,
        p: pre[pre.length - 1].p + cur.p
      }]
    ), [ps[0]]);
  
  return randoms
    .map(random => pAccs.reduce((pre, cur) =>
      random >= pre.p ? cur : pre
    ))
    .map(({ emoji }) => emoji)
};

app.get('/pull', (req, res, next) => {
  fetch('http://side-effect-proxy-ext', {
    agent: new HttpProxyAgent('http://localhost:10002'),
    headers: Object.entries(req.headers).filter(([k]) => k.startsWith('x-')),
  })
    .then(res => res.json())
    .then((json: SideEffectProxyExtRes) => {
      res.json({
        'date': new Date(json.date).toISOString(),
        'result': pull(WEIGHT_INFOS, json.randoms),
      })
    })
    .catch(next)
});

app.listen(10003);
