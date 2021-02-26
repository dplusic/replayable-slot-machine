import { Response } from "express";

export const pickResponseBody = (res: Response, picker: (chunk: any) => void) => {
  const oldWrite = res.write;
  res.write = function (chunk: any) {
    picker(chunk);
    return oldWrite.apply(res, arguments);
  }
  
  const oldSend = res.send;
  res.send = function (chunk: any) {
    picker(chunk);
    return oldSend.apply(res, arguments);
  }
}
