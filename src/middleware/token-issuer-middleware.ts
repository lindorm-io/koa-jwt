import { EmptyKeystoreError, InvalidKeystoreError } from "../error";
import { Middleware } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";
import { TokenIssuerContext } from "../types";

interface Options {
  issuer: string;
  issuerName: string;
  keystoreName: string;
}

export const tokenIssuerMiddleware =
  (options: Options): Middleware<TokenIssuerContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    if (!ctx.keystore[options.keystoreName]) {
      throw new InvalidKeystoreError();
    }
    if (ctx.keystore[options.keystoreName].getUsableKeys().length === 0) {
      throw new EmptyKeystoreError();
    }

    ctx.jwt[options.issuerName] = new TokenIssuer({
      issuer: options.issuer,
      keystore: ctx.keystore[options.keystoreName],
      logger: ctx.logger,
    });

    ctx.metrics.jwt = (ctx.metrics.jwt || 0) + (Date.now() - start);

    await next();
  };
