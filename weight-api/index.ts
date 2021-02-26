import * as express from 'express';
import { WeightInfo } from 'common/weight';
import * as bodyParser from "body-parser";

const storage
  : {
  weightInfos: WeightInfo[]
} = {
  weightInfos: [
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
  ]
};


const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/weights', (req, res, next) => {
  res.json(storage.weightInfos);
});

app.post('/weights', (req, res, next) => {
  storage.weightInfos = JSON.parse(req.body.weightInfos as string) as WeightInfo[];
  res.redirect('/weights/edit')
});

app.get('/weights/edit', (req, res, next) => {
  res.send(`
<form method="post" action="/weights">
    <p>
        <input type="submit" />
    </p>
    <p>
        <textarea
            name="weightInfos"
            style="width: 300px; height: 600px;"
        >${JSON.stringify(storage.weightInfos, null, 2)}</textarea>
    </p>
</form>
  `);
});

app.listen(10004);
