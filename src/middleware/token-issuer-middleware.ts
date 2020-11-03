import { IKoaAppContext } from "@lindorm-io/koa";
import { Keystore } from "@lindorm-io/key-pair";
import { TPromise } from "@lindorm-io/core";
import { TokenIssuer } from "@lindorm-io/jwt";

export interface ITokenIssuerContext extends IKoaAppContext {
  issuer: {
    tokenIssuer: TokenIssuer;
  };
  keystore: Keystore;
}

export interface ITokenIssuerMiddlewareOptions {
  issuer: string;
}

export const tokenIssuerMiddleware = (options: ITokenIssuerMiddlewareOptions) => async (
  ctx: ITokenIssuerContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  const { logger } = ctx;

  if (!ctx.keystore) {
    throw new Error("Keystore could not be found on context");
  }

  if (ctx.keystore.getUsableKeys().length === 0) {
    throw new Error("Keystore was initialised without keys");
  }

  ctx.issuer = {
    ...(ctx.issuer || {}),
    tokenIssuer: new TokenIssuer({
      issuer: options.issuer,
      keystore: ctx.keystore,
      logger: ctx.logger,
    }),
  };

  logger.debug("token issuer initialised", { issuer: options.issuer });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    tokenIssuer: Date.now() - start,
  };

  await next();
};
