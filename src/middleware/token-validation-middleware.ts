import { ClientError } from "@lindorm-io/errors";
import { Middleware } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";
import { TokenIssuerContext } from "../types";
import { get, isString } from "lodash";

interface MiddlewareOptions {
  audience?: string | Array<string>;
  issuer: string;
  key: string;
  type: string;
}

interface Options {
  maxAge?: string;
  nonce?: string;
  optional?: boolean;
  scope?: Array<string>;
  subject?: string;
}

export const tokenValidationMiddleware =
  (middlewareOptions: MiddlewareOptions) =>
  (path: string, options: Options = {}): Middleware<TokenIssuerContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("token");

    const { audience, issuer, key, type } = middlewareOptions;
    const { maxAge, nonce, optional, scope, subject } = options;

    const token = get(ctx, path);

    if (!isString(token) && optional) {
      ctx.logger.debug("Optional token not found", {
        [key]: token,
        path,
      });

      metric.end();

      return await next();
    }

    if (!isString(token)) {
      metric.end();

      throw new ClientError("Invalid token", {
        debug: { path, token },
        description: `${key} is expected`,
        statusCode: ClientError.StatusCode.BAD_REQUEST,
      });
    }

    try {
      ctx.token[key] = ctx.jwt.verify(token, {
        audience,
        clientId: ctx.metadata.clientId ? ctx.metadata.clientId : undefined,
        deviceId: ctx.metadata.deviceId ? ctx.metadata.deviceId : undefined,
        issuer,
        maxAge,
        nonce,
        scope,
        subject,
        type,
      });

      ctx.logger.debug("Token validated", {
        [key]: TokenIssuer.sanitiseToken(token),
      });
    } catch (err) {
      metric.end();

      throw new ClientError(err.message || "Invalid token", {
        error: err,
        debug: { middlewareOptions, options },
        description: `${key} is invalid`,
      });
    }

    metric.end();

    await next();
  };
