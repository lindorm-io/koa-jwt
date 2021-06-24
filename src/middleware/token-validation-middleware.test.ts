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
      audience: ["audience"],
      clientId: "45270e26-3d10-4827-9b79-10cbd9d426bc",
      deviceId: "7f3e4205-df61-4d3c-ad09-9998355bcd60",
      expiry: "99 seconds",
      nonce: "6142a95bc7004df59e365e37516170a9",
      scope: ["default", "edit"],
      subject: "subject",
      type: "type",
    });

    middlewareOptions = {
      audience: "audience",
      issuer: "issuer",
      key: "tokenKey",
      type: "type",
    };
    options = {
      maxAge: "90 minutes",
      nonce: "6142a95bc7004df59e365e37516170a9",
      optional: false,
      scope: ["default"],
      subject: "subject",
    };
    path = "request.body.tokenPath";

    ctx = {
      jwt,
      metadata: {
        clientId: "45270e26-3d10-4827-9b79-10cbd9d426bc",
        deviceId: "7f3e4205-df61-4d3c-ad09-9998355bcd60",
      },
      metrics: {},
      logger,
      request: {
        body: {
          tokenPath: token,
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
        subject: "subject",
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
