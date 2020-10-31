import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { TPromise } from "@lindorm-io/core";
import { TokenIssuer } from "@lindorm-io/jwt";
import { isArray } from "lodash";

export interface ITokenIssuerContext extends IKoaAppContext {
  issuers: {
    tokenIssuer: TokenIssuer;
  };
  keys: Array<KeyPair>;
}

export interface ITokenIssuerMiddlewareOptions {
  issuer: string;
}

export const tokenIssuerMiddleware = (options: ITokenIssuerMiddlewareOptions) => async (
  ctx: ITokenIssuerContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  if (!isArray(ctx.keys)) {
    throw new Error("Keys could not be found on context");
  }

  ctx.issuers = {
    ...(ctx.issuers || {}),
    tokenIssuer: new TokenIssuer({
      issuer: options.issuer,
      keystore: new Keystore({ keys: ctx.keys }),
      logger: ctx.logger,
    }),
  };

  ctx.logger.debug("token issuer initialized");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    tokenIssuer: Date.now() - start,
  };

  await next();
};
