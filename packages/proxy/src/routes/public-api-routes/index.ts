import { ModuleName } from './schemas.js';
import { defaultHandler, Handler, Handlers } from './handlers.js';
import { contractHandlers } from './contract-handlers.js';
import { accountHandlers } from './account-handlers.js';
import { logHandlers } from './log-handlers.js';

const handlers: Partial<Handlers> = {
  contract: contractHandlers,
  transaction: {}, // All transaction actions are public. They only show info about current tx.
  account: accountHandlers,
  block: {}, // All block actions are public. They don't leek tx information.
  logs: logHandlers,
  token: {}, // All token actions are public. They do not list tx or token information at least the user know it from before
  stats: {}, // Stat endpoints only show public data
};

/**
 * By default, we just broadcast public api request to the target api.
 * But certain endpoints of the public api reveal no public information.
 * For those we create special handlers
 * @param module
 * @param action
 */
export function findHandler(module: ModuleName, action: string): Handler {
  const mod = handlers[module];
  if (!mod) {
    return defaultHandler;
  }
  const handler = mod[action];
  if (!handler) {
    return defaultHandler;
  }
  return handler;
}
