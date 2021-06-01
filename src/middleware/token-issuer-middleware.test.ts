import MockDate from "mockdate";
import { EmptyKeystoreError, InvalidKeystoreError } from "../error";
import { Keystore } from "@lindorm-io/key-pair";
import { getTestKeystore, logger } from "../test";
import { tokenIssuerMiddleware } from "./token-issuer-middleware";

MockDate.set("2020-01-01T08:00:00.000Z");

const next = jest.fn();

describe("tokenIssuerMiddleware", () => {
  let ctx: any;
  let options: any;

  beforeEach(() => {
    ctx = {
      keystore: {
        keystoreName: getTestKeystore(),
      },
      metrics: {},
      logger,
    };
    options = {
      issuer: "issuer",
      issuerName: "issuerName",
      keystoreName: "keystoreName",
    };
  });

  test("should set issuer on context", async () => {
    await expect(tokenIssuerMiddleware(options)(ctx, next)).resolves.toBeUndefined();
    expect(ctx.issuer).toMatchSnapshot();
  });

  test("should throw InvalidKeystoreError", async () => {
    ctx = { logger };
    await expect(tokenIssuerMiddleware(options)(ctx, next)).rejects.toStrictEqual(expect.any(InvalidKeystoreError));
  });

  test("should throw InvalidKeystoreError", async () => {
    ctx = { keystore: { keystoreName: new Keystore({ keys: [] }), logger } };
    await expect(tokenIssuerMiddleware(options)(ctx, next)).rejects.toStrictEqual(expect.any(EmptyKeystoreError));
  });
});
