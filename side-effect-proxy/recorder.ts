import { createIORecord, IORecord } from "./record";

export type Recorder = {
  
  add: (
    seId: string,
    ioRecord: IORecord,
  ) => void;
  
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
    dumpAndRemove,
  }
}
