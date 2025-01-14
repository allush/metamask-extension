// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
let __define;

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
const cleanContextForImports = () => {
  __define = global.define;
  try {
    global.define = undefined;
  } catch (_) {
    console.warn('MetaMask - global.define could not be deleted.');
  }
};

/**
 * Restores global define object from cached reference
 */
const restoreContextAfterImports = () => {
  try {
    global.define = __define;
  } catch (_) {
    console.warn('MetaMask - global.define could not be overwritten.');
  }
};

cleanContextForImports();

/* eslint-disable import/first */
import log from 'loglevel';
import LocalMessageDuplexStream from 'post-message-stream';
import { initializeProvider } from '@metamask/inpage-provider';

restoreContextAfterImports();

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn');

//
// setup plugin communication
//

// setup background connection
const metamaskStream = new LocalMessageDuplexStream({
  name: 'ethereum2-inpage',
  target: 'ethereum2-contentscript',
});

initializeProvider({
  connectionStream: metamaskStream,
  jsonRpcStreamName: 'ethereum2-provider',
  logger: log,
  shouldShimWeb3: true,
});
