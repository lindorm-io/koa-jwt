import { APIError, HttpStatus, TObject, TPromise } from "@lindorm-io/global";
import { Context } from "koa";
import { IVerifyData, sanitiseToken, TokenIssuer } from "@lindorm-io/jwt";
import { Logger } from "@lindorm-io/winston";
import { getAuthorizationHeader } from "@lindorm-io/common";

export interface IBearerTokenContext extends Context {
  issuers: {
    tokenIssuer: TokenIssuer;
  };
  logger: Logger;
  metrics: TObject<number>;
  tokens: TObject<IVerifyData>;
}

export interface IBearerTokenMiddlewareOptions {
  audience: string;
  issuer: string;
}

export const bearerTokenMiddleware = (options: IBearerTokenMiddlewareOptions) => async (
  ctx: IBearerTokenContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  const authorization = getAuthorizationHeader(ctx.get("Authorization"));

  if (authorization.type !== "Bearer") {
    throw new APIError("Invalid Authorization Header", {
      details: "Expected header to be: Bearer",
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }

  const token = authorization.value;

  ctx.logger.debug("Bearer Token Auth identified", { token: sanitiseToken(token) });

  ctx.tokens = {
    ...(ctx.tokens || {}),
    bearer: ctx.issuers.tokenIssuer.verify({
      audience: options.audience,
      issuer: options.issuer,
      token,
    }),
  };

  ctx.metrics = {
    ...(ctx.metrics || {}),
    bearerToken: Date.now() - start,
  };

  await next();
};
