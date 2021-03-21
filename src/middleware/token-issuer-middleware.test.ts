import { Algorithm, KeyPair, Keystore, KeyType } from "@lindorm-io/key-pair";
import { EmptyKeystoreError, InvalidKeystoreError } from "../error";
import { tokenIssuerMiddleware } from "./token-issuer-middleware";
import { TokenIssuer } from "@lindorm-io/jwt";

const options = { issuer: "issuer" };
const keystore = new Keystore({
  keys: [
    new KeyPair({
      algorithm: Algorithm.ES512,
      allowed: true,
      privateKey:
        "-----BEGIN PRIVATE KEY-----\n" +
        "MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIBGma7xGZpaAngFXf3\n" +
        "mJF3IxZfDpI+6wU564K+eehxX104v6dZetjSfMx0rvsYX/s6cO2P3GE7R95VxWEk\n" +
        "+f4EX0qhgYkDgYYABAB8cBfDwCi41G4kVW4V3Y86nIMMCypYzfO8gYjpS091lxkM\n" +
        "goTRS3LM1p65KQfwBolrWIdVrbbOILASf06fQsHw5gEt4snVuMBO+LS6pesX9vA8\n" +
        "QT1LjX75Xq2InnLY1VToeNmxkuM+oDZgqHOYwzfUhu+zZaA5AuEkqPi47TA9iCSY\n" +
        "VQ==\n" +
        "-----END PRIVATE KEY-----\n",
      publicKey:
        "-----BEGIN PUBLIC KEY-----\n" +
        "MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAfHAXw8AouNRuJFVuFd2POpyDDAsq\n" +
        "WM3zvIGI6UtPdZcZDIKE0UtyzNaeuSkH8AaJa1iHVa22ziCwEn9On0LB8OYBLeLJ\n" +
        "1bjATvi0uqXrF/bwPEE9S41++V6tiJ5y2NVU6HjZsZLjPqA2YKhzmMM31Ibvs2Wg\n" +
        "OQLhJKj4uO0wPYgkmFU=\n" +
        "-----END PUBLIC KEY-----\n",
      type: KeyType.EC,
    }),
  ],
});
const logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
  createChildLogger: () => logger,
};
const next = () => Promise.resolve();

describe("tokenIssuerMiddleware", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      keystore,
      logger,
    };
  });

  test("should set issuer on context", async () => {
    await expect(tokenIssuerMiddleware(options)(ctx, next)).resolves.toBe(undefined);
    expect(ctx.issuer.tokenIssuer).toStrictEqual(expect.any(TokenIssuer));
  });

  test("should throw InvalidKeystoreError", async () => {
    ctx = { logger };
    await expect(tokenIssuerMiddleware(options)(ctx, next)).rejects.toStrictEqual(expect.any(InvalidKeystoreError));
  });

  test("should throw InvalidKeystoreError", async () => {
    ctx = { keystore: new Keystore({ keys: [] }), logger };
    await expect(tokenIssuerMiddleware(options)(ctx, next)).rejects.toStrictEqual(expect.any(EmptyKeystoreError));
  });
});
