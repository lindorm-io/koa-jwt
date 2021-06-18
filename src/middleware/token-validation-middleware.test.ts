import MockDate from "mockdate";
import { Metric } from "@lindorm-io/koa";
import { getTestJwt, logger } from "../test";
import { tokenValidationMiddleware } from "./token-validation-middleware";
import { ClientError } from "@lindorm-io/errors";

MockDate.set("2021-01-01T08:00:00.000Z");

const next = () => Promise.resolve();

describe("tokenValidationMiddleware", () => {
  let options: any;
  let path: string;
  let ctx: any;

  beforeEach(() => {
    const jwt = getTestJwt();
    const { token } = jwt.sign({
      audience: "audience",
      expiry: "99 seconds",
      scope: ["default", "edit"],
      subject: "subject",
    });

    options = {
      audience: "audience",
      issuer: "issuer",
      key: "tokenKey",
      optional: false,
    };
    path = "request.body.tokenPath";

    ctx = {
      jwt,
      metadata: {},
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
    await expect(tokenValidationMiddleware(options)(path)(ctx, next)).resolves.toBeUndefined();

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

    await expect(tokenValidationMiddleware(options)(path)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.token.tokenKey).toBeUndefined();
  });

  test("should validate token scope", async () => {
    await expect(tokenValidationMiddleware(options)(path, ["default", "edit"])(ctx, next)).resolves.toBeUndefined();

    expect(ctx.token.tokenKey).toStrictEqual(
      expect.objectContaining({
        subject: "subject",
        token: expect.any(String),
      }),
    );
    expect(ctx.metrics.token).toStrictEqual(expect.any(Number));
  });

  test("should throw when token is not on path", async () => {
    ctx.request.body.tokenPath = undefined;

    await expect(tokenValidationMiddleware(options)(path)(ctx, next)).rejects.toThrow(ClientError);
  });

  test("should throw when scope is invalid", async () => {
    await expect(tokenValidationMiddleware(options)(path, ["default", "edit", "openid"])(ctx, next)).rejects.toThrow(
      ClientError,
    );
  });
});
