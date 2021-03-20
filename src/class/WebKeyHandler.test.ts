import { WebKeyHandler } from "./WebKeyHandler";
import { WebKeyHandlerError } from "../error";

let keys: Array<any> = [];

jest.mock("axios", () => ({
  get: jest.fn(() => ({
    data: { keys },
  })),
}));

describe("JWKSHandler.ts", () => {
  let handler: WebKeyHandler;

  beforeEach(() => {
    keys = [
      {
        kid: "mock-id",
        alg: "RS512",
        n: "mock-public-key",
        c: "2020-01-01 09:00:00.000",
        kty: "mock-type",
      },
    ];

    handler = new WebKeyHandler({
      host: "http://localhost",
      logger: {
        // @ts-ignore
        createChildLogger: jest.fn(() => ({
          debug: jest.fn(),
        })),
      },
    });
  });

  test("should get keys", async () => {
    await expect(handler.getKeys()).resolves.toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "mock-id",
          algorithm: "RS512",
          publicKey: "mock-public-key",
          type: "mock-type",
        }),
      ]),
    );
  });

  test("should throw error if there are no keys", async () => {
    keys = [];

    await expect(handler.getKeys()).rejects.toStrictEqual(expect.any(WebKeyHandlerError));
  });
});
