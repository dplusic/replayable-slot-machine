import { IncomingHttpHeaders } from "http";
import * as Fetch from "node-fetch";

export const headersArrayFromIncomingHttpHeaders = (incomingHttpHeaders: IncomingHttpHeaders): string[][] =>
  Object.entries(incomingHttpHeaders)
    .flatMap(([key, value]) => {
      if (typeof (value) === 'object') {
        return (value as string[]).map(x => ([key, x]));
      } else if (typeof (value) === 'string') {
        return [[key, value]]
      } else {
        return []
      }
    });

export const headersArrayFromHeadersInit = (headersInit: Fetch.HeadersInit): string[][] => {
  if (headersInit instanceof Fetch.Headers) {
    return Array.from(headersInit)
  } else if (Array.isArray(headersInit)) {
    return headersInit
  } else {
    return Object.entries(headersInit);
  }
}