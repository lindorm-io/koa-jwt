import { ClientError } from "@lindorm-io/errors";
import { Middleware } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";
import { TokenIssuerContext } from "../types";
import { camelCase } from "@lindorm-io/core";
import { get, isString } from "lodash";

interface MiddlewareOptions {
  audience?: string;
  issuer: string;
  key?: string;
  maxAge?: string;
  type: string;
}

export interface TokenValidationOptions {
  nonce?: string;
  optional?: boolean;
  scope?: string;
  subject?: string;
}

export const tokenValidationMiddleware =
  (middlewareOptions: MiddlewareOptions) =>
  (path: string, options: TokenValidationOptions = {}): Middleware<TokenIssuerContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("token");

    const { audience, issuer, maxAge, type } = middlewareOptions;
    const { nonce, optional, scope, subject } = options;
    const key = middlewareOptions.key || `${camelCase(type)}Token`;

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
        nonce: nonce ? get(ctx, nonce) : undefined,
        scope: scope ? get(ctx, scope) : undefined,
        subject: subject ? get(ctx, subject) : undefined,
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
