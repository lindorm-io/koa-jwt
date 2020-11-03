import { JWKSHandler } from "../class";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { TFunction, TPromise } from "@lindorm-io/core";
import { IKoaAppContext } from "@lindorm-io/koa";

export interface IJWKSContext extends IKoaAppContext {
  keystore: Keystore;
}

export interface IJWKSMiddlewareOptions {
  host: string;
  logger: Logger;
  path: string;
}

export const jwksMiddleware = (options: IJWKSMiddlewareOptions): TFunction<Promise<void>> => {
  const handler = new JWKSHandler(options);

  return async (ctx: IJWKSContext, next: TPromise<void>): Promise<void> => {
    const start = Date.now();

    const { logger } = ctx;

    const keys = await handler.getKeys();

    ctx.keystore = new Keystore({ keys });

    logger.debug("keystore initialised", { keys });

    ctx.metrics = {
      ...(ctx.metrics || {}),
      keystore: Date.now() - start,
    };

    await next();
  };
};
