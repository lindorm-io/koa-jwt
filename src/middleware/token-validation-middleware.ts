import { ClientError } from "@lindorm-io/errors";
import { Middleware } from "@lindorm-io/koa";
import { TokenIssuerContext } from "../types";
import { get, isString } from "lodash";
import { sanitiseToken } from "@lindorm-io/jwt";

interface Options {
  audience: string;
  issuer: string;
  key: string;
  path: string;
  optional: boolean;
}

export const tokenValidationMiddleware =
  ({ audience, issuer, key, path, optional = false }: Options): Middleware<TokenIssuerContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("token");

    const token = get(ctx.request.body, path);

    if (!isString(token) && optional) {
      ctx.logger.debug("Optional token not found", {
        [key]: token,
        path,
      });

      metric.end();

      return await next();
    }

    try {
      ctx.token[key] = ctx.jwt.verify({
        audience: audience,
        clientId: ctx.metadata.clientId,
        deviceId: ctx.metadata.deviceId,
        issuer: issuer,
        token,
      });

      ctx.logger.debug("Token validated", {
        [key]: sanitiseToken(token),
      });
    } catch (err) {
      metric.end();

      ctx.logger.debug("Token not found on path", {
        [key]: token,
        path,
      });

      throw new ClientError("Invalid token", {
        error: err,
        debug: { audience, issuer, key, path },
        description: `${key} is invalid`,
      });
    }

    metric.end();

    await next();
  };
