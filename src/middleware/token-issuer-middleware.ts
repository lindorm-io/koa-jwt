import { TokenIssuer } from "@lindorm-io/jwt";
import { EmptyKeystoreError, InvalidKeystoreError } from "../error";
import { IKoaTokenIssuerContext, ITokenIssuerMiddlewareOptions, TNext } from "../types";

export const tokenIssuerMiddleware = (options: ITokenIssuerMiddlewareOptions) => async (
  ctx: IKoaTokenIssuerContext,
  next: TNext,
): Promise<void> => {
  const start = Date.now();

  const { logger } = ctx;

  if (!ctx.keystore) {
    throw new InvalidKeystoreError();
  }

  if (ctx.keystore.getUsableKeys().length === 0) {
    throw new EmptyKeystoreError();
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
