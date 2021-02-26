import { promises as fsp } from 'fs';
import { Config } from "./config";
import express from "express";
import { IORecord, ResponseRecord } from "./record";
import { v4 as uuidv4 } from 'uuid';
import fetch from "node-fetch";

type Records = { [seId: string]: IORecord };

const loadRecords = (recordsPath: string): Promise<Records> =>
  fsp.readFile(recordsPath, { encoding: 'utf-8' })
    .then(content => {
      const lines = content.split('\n');
      const entries = lines
        .filter(line => line.length > 0)
        .map(line => [uuidv4(), JSON.parse(line) as IORecord]);
      return Object.fromEntries(entries);
    })

const startApp = ({
  config,
  records,
}: {
  config: Config,
  records: Records,
}) => {
  
  const lookupTable: { [seId: string]: { [url: string]: ResponseRecord } } = Object.fromEntries(Object.entries(records)
    .map(([seId, records]) => ([
      seId,
      Object.fromEntries(records.sideEffects
        .map((sideEffectRecord) => ([
            sideEffectRecord.request.url,
            sideEffectRecord.response,
          ])
        )
      )
    ]))
  )
  
  const app = express();
  
  app.use('/', (req, res) => {
    const seId = req.headers[config.sideEffectIdHeaderKey] as string;
    const responseBody = lookupTable[seId][req.url].body;
    res.end(responseBody);
  });
  
  app.listen(config.outboundPort);
}

const startReplay = ({
  config,
  records,
}: {
  config: Config,
  records: Records
}): Promise<void> =>
  Object.entries(records)
    .reduce((prevPromise, [seId, record]) =>
        prevPromise.then(() =>
          fetch(`${config.appTarget}${record.request.url}`, {
            headers: {
              [config.sideEffectIdHeaderKey]: seId,
            }
          })
            .then(res => res.text())
            .then(text => {
              if (text === record.response.body) {
                console.log('Pass');
              } else {
                console.log('Fail');
                console.log(`  Expected: ${record.response.body}`)
                console.log(`    Actual: ${text}`)
              }
            })),
      Promise.resolve())


export const startReplayer = ({
  config,
}: {
  config: Config,
}) => {
  loadRecords(config.recordsPath)
    .then(records => {
      
      startApp({
        config,
        records,
      });
      
      return startReplay({
        config,
        records,
      });
    })
    .then(() => {
      process.exit(0);
    })
    .catch(e => console.error(e));
};
