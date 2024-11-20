import { ModuleName } from './schemas.js';
import { defaultHandler, Handler, Handlers } from './handlers.js';
import { contractHandlers } from './contract-handlers.js';

const handlers: Partial<Handlers> = {
  contract: contractHandlers,
};

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
