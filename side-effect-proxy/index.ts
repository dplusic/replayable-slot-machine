import { start as startInboundApp } from './inboundApp';
import { start as startOutboundApp } from './outboundApp';
import { createRecorder } from "./recorder";
import { getConfig } from './config'

const config = getConfig();

const recorder = createRecorder({
  config,
});

startInboundApp({
  config,
  recorder,
});
startOutboundApp({
  config,
  recorder,
});
