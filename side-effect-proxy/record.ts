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
}: {
  url: string,
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
}: {
  url: string,
}): SideEffectRecord => {
  return {
    request: {
      url,
    },
    response: {},
  }
}
