import MockDate from "mockdate";
import { EmptyKeystoreError, InvalidKeystoreError } from "../error";
import { Algorithm, KeyPair, Keystore, KeyType, NamedCurve } from "@lindorm-io/key-pair";
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
      jwt: {},
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
    expect(ctx.jwt).toMatchSnapshot();
  });

  test("should throw InvalidKeystoreError", async () => {
    ctx.keystore.keystoreName = undefined;
    await expect(tokenIssuerMiddleware(options)(ctx, next)).rejects.toStrictEqual(expect.any(InvalidKeystoreError));
  });

  test("should throw InvalidKeystoreError", async () => {
    ctx = {
      keystore: {
        keystoreName: new Keystore({
          keys: [
            new KeyPair({
              id: "59c9f0ac-115a-47b1-b635-a85f88729fc7",
              expires: new Date("1980-01-01T00:00:00.000Z"),
              type: KeyType.EC,
              algorithms: [Algorithm.ES512],
              namedCurve: NamedCurve.P521,
              privateKey: "privateKey",
              publicKey: "publicKey",
            }),
          ],
        }),
        logger,
      },
    };
    await expect(tokenIssuerMiddleware(options)(ctx, next)).rejects.toStrictEqual(expect.any(EmptyKeystoreError));
  });
});
