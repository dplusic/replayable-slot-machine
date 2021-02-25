import { start as startInboundApp } from './inboundApp';
import { start as startOutboundApp } from './outboundApp';
import { createRecorder } from "./recorder";

const recorder = createRecorder();

startInboundApp({ recorder });
startOutboundApp({ recorder });
