import express from 'express';
import { WeightInfo } from 'common/weight';
import { fetchThroughProxy, proxyMiddleware } from "./proxy";

type SideEffectProxyExtRes = {
  date: number,
  randoms: number[],
}

const app = express();
app.use(proxyMiddleware());

const fetchSideEffectProxyExt = (): Promise<SideEffectProxyExtRes> =>
  fetchThroughProxy('http://side-effect-proxy-ext')
    .then(res => res.json())

const fetchWeightInfos = (): Promise<WeightInfo[]> =>
  fetchThroughProxy('http://localhost:10004/weights')
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

app.get('/pull', (req, res, next) =>
  Promise.all([
    fetchSideEffectProxyExt(),
    fetchWeightInfos(),
  ])
    .then(([sideEffectProxyExtRes, weightInfos]: [SideEffectProxyExtRes, WeightInfo[]]) => {
      res.json({
        'date': new Date(sideEffectProxyExtRes.date).toISOString(),
        'result': pull(weightInfos, sideEffectProxyExtRes.randoms),
      })
    })
);

app.listen(10003);
