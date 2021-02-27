import * as express from "express";
import bodyParser from "body-parser";

export const router = express.Router();

router.use(bodyParser.json());

const evaluation = (expr: string) => {
  switch (expr) {
    case 'date':
      return Date.now();
    case 'random':
      return Math.random();
    default:
      return null;
  }
}

router.post('/bulk', (req, res) => {
  const result = Object.fromEntries(Object.entries(req.body as { [key: string]: string })
    .map(([key, expr]) => ([
      key, evaluation(expr)
    ]))
  );
  res.json(result);
});
