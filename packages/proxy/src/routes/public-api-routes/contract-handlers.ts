import { defaultHandler, Handler } from './handlers.js';
import { getContractOwner } from '../../services/rpc.js';
import { z } from 'zod';
import { addressSchema } from '../../utils/schemas.js';
import { HttpError } from '../../utils/http-error.js';
import { isAddressEqual, zeroAddress } from 'viem';
import { getUserOrThrow } from '../../services/user.js';

const withAddressSchema = z.object({
  address: addressSchema,
});

const withCreatorAddressSchema = z
  .object({
    contractCreator: addressSchema,
    contractAddress: addressSchema,
  })
  .passthrough();

/**
 * Only the owner of the contract is allowed to require the source code.
 * TODO: We could also allow the deployer.
 * @param app
 * @param req
 * @param reply
 */
const getsourcecode: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);
  const address = withAddressSchema.parse(req.query).address;

  const owner = await getContractOwner(app.conf.rpcUrl, address);
  if (owner !== user) {
    throw new HttpError('Only owners can see source code', 403);
  }

  return defaultHandler(app, req, reply);
};

/**
 * We only allow users to see deployments of things that they have deployed
 * to avoid reveal transaction ids out of the scope of the current user.
 * @param app
 * @param req
 * @param reply
 */
const getcontractcreation: Handler = async (app, req, reply) => {
  const user = req.user || zeroAddress;
  const targetUrl = `${app.conf.proxyTarget}${req.url}`;
  const data = await fetch(targetUrl)
    .then((res) => res.json())
    .then((json) => z.array(withCreatorAddressSchema).parse(json));

  const some = data.find((obj) => !isAddressEqual(obj.contractCreator, user));

  if (some) {
    throw new HttpError(
      `Current user did not deploy: ${some.contractAddress}`,
      403,
    );
  }

  return reply.send(data);
};

export const contractHandlers = {
  getsourcecode,
  getcontractcreation,
};
