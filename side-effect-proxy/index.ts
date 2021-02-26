import * as process from 'process';
import { start as startInboundApp } from './inboundApp';
import { start as startOutboundApp } from './outboundApp';
import { createRecorder } from "./recorder";
import { getConfig } from './config'
import { startReplayer } from "./replayer";

const config = getConfig();

const startProxy = () => {
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
}

if (process.argv.length >= 3) {
  switch (process.argv[2]) {
    case 'proxy':
      startProxy();
      break;
    case 'replay':
      startReplayer({
        config,
      })
      break;
    default:
      console.error('Invalid command');
      process.exit(1);
  }
} else {
  startProxy();
}
