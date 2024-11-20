import { ModuleName } from './schemas.js';
import { defaultHandler, Handler, Handlers } from './handlers.js';
import { contractHandlers } from './contract-handlers.js';
import { accountHandlers } from './account-handlers.js';

const handlers: Partial<Handlers> = {
  contract: contractHandlers,
  account: accountHandlers,
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
