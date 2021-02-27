import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';

export default (_: NextApiRequest, res: NextApiResponse) =>
  fetch('http://localhost:10001/pull')
    .then(({ body }) => body.pipe(res));
