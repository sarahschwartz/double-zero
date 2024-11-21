import { Handler } from './handlers.js';
import { buildUrl } from '../../utils/url.js';
import { getUserOrThrow } from '../../services/user.js';
import { publicLogSchema } from './schemas.js';
import { Hex, pad } from 'viem';
import { paginate } from './generic-handlers.js';

function areHexEqual(a: Hex, b: Hex): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

const getLogs: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);

  const url = buildUrl(`${app.conf.proxyTarget}/api`, {
    ...req.query,
    page: 1,
    offset: 1000,
  });

  const data = await fetch(url)
    .then((res) => res.json())
    .then(publicLogSchema.parse);

  if (data.status === '0') {
    return reply.send(data);
  }

  const paddedUser = pad(user);
  const filtered = data.result.filter((log) => {
    return log.topics.some((topic) => areHexEqual(topic, paddedUser));
  });

  const res = {
    ...data,
    result: paginate(filtered, req.query.page, req.query.offset),
  };

  return reply.send(res);
};

export const logHandlers = {
  getLogs,
};
