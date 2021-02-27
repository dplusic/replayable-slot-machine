import { promises as fsp } from 'fs'
import { IORecord, ResponseRecord } from "./record";
import { Request, Response } from "express";
import { pickResponseBody } from "./responseBodyPicker";
import { Config } from "./config";

export type Recorder = {
  
  add: (
    seId: string,
    ioRecord: IORecord,
  ) => void;
  
  get: (
    seId: string,
  ) => IORecord,
  
  finish: (
    seId: string,
  ) => void
}

export const createRecorder = ({
  config,
}: {
  config: Config,
}): Recorder => {
  const records: { [seId: string]: IORecord } = {}
  
  const add = (
    seId: string,
    ioRecord: IORecord,
  ) => {
    records[seId] = ioRecord;
  };
  
  const get = (
    seId: string,
  ) => {
    return records[seId];
  }
  
  const dump = (
    seId: string
  ) => {
    const record = records[seId];
    console.log(JSON.stringify(record, null, 2));
    fsp.appendFile(config.recordsPath, JSON.stringify(record) + '\n')
      .catch(e => console.error(e));
  }
  
  const remove = (
    seId: string
  ) => {
    delete records[seId];
  }
  
  const finish = (
    seId: string,
  ) => {
    dump(seId);
    remove(seId);
  }
  
  return {
    add,
    get,
    finish,
  }
}

export const recordRequest = (requestRecord: ResponseRecord, req: Request) => {
  
  requestRecord.body = '';
  
  req.on('data', (data) => {
    requestRecord.body += data.toString();
  });
}

export const recordResponse = (responseRecord: ResponseRecord, res: Response, onFinish?: () => void) => {
  
  responseRecord.body = '';
  
  pickResponseBody(res, chunk => {
    responseRecord.body += chunk.toString();
  })
  
  res.on('finish', () => {
    responseRecord.statusCode = res.statusCode;
    responseRecord.statusMessage = res.statusMessage;
    
    if (onFinish) {
      onFinish();
    }
  });
}