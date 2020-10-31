import { APIError, HttpStatus, TObject, TPromise, getAuthorizationHeader } from "@lindorm-io/core";
import { IKoaAppContext } from "@lindorm-io/koa";
import { IVerifyData, sanitiseToken, TokenIssuer } from "@lindorm-io/jwt";

export interface IBearerTokenContext extends IKoaAppContext {
  issuer: {
    tokenIssuer: TokenIssuer;
  };
  token: TObject<IVerifyData>;
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

  const verified = ctx.issuer.tokenIssuer.verify({
    audience: options.audience,
    issuer: options.issuer,
    token,
  });

  ctx.token = {
    ...(ctx.token || {}),
    bearer: verified,
  };

  ctx.metrics = {
    ...(ctx.metrics || {}),
    bearerToken: Date.now() - start,
  };

  await next();
};
