import MockDate from "mockdate";
import { ClientError } from "@lindorm-io/errors";
import { Metric } from "@lindorm-io/koa";
import { getTestJwt, logger } from "../test";
import { tokenValidationMiddleware } from "./token-validation-middleware";

MockDate.set("2021-01-01T08:00:00.000Z");

const next = () => Promise.resolve();

describe("tokenValidationMiddleware", () => {
  let middlewareOptions: any;
  let options: any;
  let path: string;
  let ctx: any;

  beforeEach(() => {
    const jwt = getTestJwt();
    const { token } = jwt.sign({
      audience: ["45270e26-3d10-4827-9b79-10cbd9d426bc"],
      expiry: "99 seconds",
      nonce: "6142a95bc7004df59e365e37516170a9",
      scopes: ["default", "edit"],
      subject: "c57ed8ee-0797-44dd-921b-3db030879ec6",
      type: "type",
    });

    middlewareOptions = {
      issuer: "issuer",
      key: "tokenKey",
      maxAge: "90 minutes",
      type: "type",
    };
    options = {
      nonce: "request.body.nonce",
      optional: false,
      scopes: "request.body.scopes",
      subject: "request.body.subject",
    };
    path = "request.body.tokenPath";

    ctx = {
      jwt,
      logger,
      metadata: {
        clientId: "45270e26-3d10-4827-9b79-10cbd9d426bc",
      },
      metrics: {},
      request: {
        body: {
          tokenPath: token,
          nonce: "6142a95bc7004df59e365e37516170a9",
          scopes: ["default"],
          subject: "c57ed8ee-0797-44dd-921b-3db030879ec6",
        },
      },
      token: {},
    };

    ctx.getMetric = (key: string) => new Metric(ctx, key);
  });

  test("should validate token on path", async () => {
    await expect(tokenValidationMiddleware(middlewareOptions)(path)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.token.tokenKey).toStrictEqual(
      expect.objectContaining({
        subject: "c57ed8ee-0797-44dd-921b-3db030879ec6",
        token: expect.any(String),
      }),
    );
    expect(ctx.metrics.token).toStrictEqual(expect.any(Number));
  });

  test("should succeed when token on path is optional", async () => {
    options.optional = true;
    ctx.request.body.tokenPath = undefined;

    await expect(tokenValidationMiddleware(middlewareOptions)(path, options)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.token.tokenKey).toBeUndefined();
  });

  test("should throw when token is not on path", async () => {
    ctx.request.body.tokenPath = undefined;

    await expect(tokenValidationMiddleware(middlewareOptions)(path)(ctx, next)).rejects.toThrow(ClientError);
  });
});
