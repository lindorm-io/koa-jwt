import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { TFunction, TPromise } from "@lindorm-io/core";
import { WebKeyHandler } from "../class";
import { isArray } from "lodash";

export interface IKoaWebKeyContext extends IKoaAppContext {
  keystore: Keystore;
}

export interface IWebKeyMiddlewareOptions {
  host: string;
  path: string;
  logger: Logger;
  inMemoryKeys?: Array<KeyPair>;
}

const getKeys = async (handler: WebKeyHandler, inMemoryKeys?: Array<KeyPair>): Promise<Array<KeyPair>> => {
  if (isArray(inMemoryKeys)) {
    return inMemoryKeys;
  }
  return await handler.getKeys();
};

export const webKeyMiddleware = (options: IWebKeyMiddlewareOptions): TFunction<Promise<void>> => {
  const handler = new WebKeyHandler(options);
  const { inMemoryKeys } = options;

  return async (ctx: IKoaWebKeyContext, next: TPromise<void>): Promise<void> => {
    const start = Date.now();

    const { logger } = ctx;

    const keys = await getKeys(handler, inMemoryKeys);

    ctx.keystore = new Keystore({ keys });

    logger.debug("keystore initialised", { keys });

    ctx.metrics = {
      ...(ctx.metrics || {}),
      keystore: Date.now() - start,
    };

    await next();
  };
};
