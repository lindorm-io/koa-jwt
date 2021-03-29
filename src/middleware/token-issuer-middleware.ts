import { EmptyKeystoreError, InvalidKeystoreError } from "../error";
import { IKoaTokenIssuerContext, ITokenIssuerMiddlewareOptions } from "../types";
import { Middleware } from "koa";
import { TNext } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";

export const tokenIssuerMiddleware = (options: ITokenIssuerMiddlewareOptions): Middleware => {
  const { issuer, issuerName, keystoreName } = options;

  return async (ctx: IKoaTokenIssuerContext, next: TNext): Promise<void> => {
    const start = Date.now();

    if (!ctx.keystore || !ctx.keystore[keystoreName]) {
      throw new InvalidKeystoreError();
    }

    if (ctx.keystore[keystoreName].getUsableKeys().length === 0) {
      throw new EmptyKeystoreError();
    }

    ctx.issuer = {
      ...(ctx.issuer || {}),
      [issuerName]: new TokenIssuer({
        issuer,
        keystore: ctx.keystore[keystoreName],
        logger: ctx.logger,
      }),
    };

    ctx.logger.debug("token issuer initialised", { issuer });

    ctx.metrics = {
      ...(ctx.metrics || {}),
      tokenIssuer: Date.now() - start,
    };

    await next();
  };
};
