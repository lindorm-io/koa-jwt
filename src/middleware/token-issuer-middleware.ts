import { EmptyKeystoreError, InvalidKeystoreError } from "../error";
import { Middleware } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";
import { TokenIssuerContext } from "../types";

interface Options {
  issuer: string;
}

export const tokenIssuerMiddleware =
  (options: Options): Middleware<TokenIssuerContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("jwt");

    if (!ctx.keystore) {
      throw new InvalidKeystoreError();
    }
    if (ctx.keystore.getKeys().length === 0) {
      throw new EmptyKeystoreError();
    }

    ctx.jwt = new TokenIssuer({
      issuer: options.issuer,
      keystore: ctx.keystore,
      logger: ctx.logger,
    });

    metric.end();

    await next();
  };
