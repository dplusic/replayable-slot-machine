export type RequestRecord = {
  url: string,
  body?: string,
};

export type ResponseRecord = {
  statusCode?: number,
  statusMessage?: string,
  body?: string
};

export type Record = {
  request: RequestRecord,
  response: ResponseRecord,
}

export type SideEffectRecord = Record;

export type IORecord = Record & {
  sideEffects: SideEffectRecord[],
}

export const createIORecord = ({
  url,
  body,
}: {
  url: string,
  body?: string,
}): IORecord => {
  return {
    request: {
      url,
    },
    response: {},
    sideEffects: [],
  }
}

export const createSideEffectRecord = ({
  url,
  body,
}: {
  url: string,
  body?: string
}): SideEffectRecord => {
  return {
    request: {
      url,
      body,
    },
    response: {},
  }
}
