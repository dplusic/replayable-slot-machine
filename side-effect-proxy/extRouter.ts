import * as express from "express";

export const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    date: Date.now(),
    randoms: [
      Math.random(),
      Math.random(),
      Math.random(),
    ]
  })
});
