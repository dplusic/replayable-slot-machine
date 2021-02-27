import { IncomingHttpHeaders } from "http";

export const headersArrayFromIncomingHttpHeaders = (expressHeaders: IncomingHttpHeaders): string[][] =>
  Object.entries(expressHeaders)
    .flatMap(([key, value]) => {
      if (typeof (value) === 'object') {
        return (value as string[]).map(x => ([key, x]));
      } else if (typeof (value) === 'string') {
        return [[key, value]]
      } else {
        return []
      }
    });
