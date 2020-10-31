import { JWKSHandler } from "../class";
import { KeyPair } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { TFunction, TPromise } from "@lindorm-io/core";
import { IKoaAppContext } from "@lindorm-io/koa";

export interface IJWKSContext extends IKoaAppContext {
  keys: Array<KeyPair>;
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

    ctx.keys = await handler.getKeys();
    ctx.metrics = {
      ...(ctx.metrics || {}),
      keys: Date.now() - start,
    };
    ctx.logger.debug("keys initialized", { keys: ctx.keys });

    await next();
  };
};
