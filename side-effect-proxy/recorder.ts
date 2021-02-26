import { IORecord, ResponseRecord } from "./record";
import { Response } from "express";
import { pickResponseBody } from "./responseBodyPicker";

export type Recorder = {
  
  add: (
    seId: string,
    ioRecord: IORecord,
  ) => void;
  
  get: (
    seId: string,
  ) => IORecord,
  
  dumpAndRemove: (
    seId: string,
  ) => void
}

export const createRecorder = (): Recorder => {
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
    console.log(JSON.stringify(records[seId], null, 2));  // TODO
  }
  
  const remove = (
    seId: string
  ) => {
    delete records[seId];
  }
  
  const dumpAndRemove = (
    seId: string,
  ) => {
    dump(seId);
    remove(seId);
  }
  
  return {
    add,
    get,
    dumpAndRemove,
  }
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