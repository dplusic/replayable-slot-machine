export type Config = {
  inboundPort: number,
  outboundPort: number,
  
  appTarget: string,
  
  sideEffectIdHeaderKey: string,
};

export const getConfig = (): Config => ({
  inboundPort: 10001,
  outboundPort: 10002,
  
  appTarget: 'http://localhost:10003',
  
  sideEffectIdHeaderKey: 'x-side-effect-id',
});
