import axios from "axios";
import { KeyPair } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { URL } from "url";
import { WebKeyHandlerError } from "../error";
import { WellKnown } from "../enum";

export interface IJWKSHandlerOptions {
  host: string;
  logger: Logger;
}

export class WebKeyHandler {
  private logger: Logger;
  private url: URL;

  constructor(options: IJWKSHandlerOptions) {
    this.logger = options.logger.createChildLogger(["jwks", "handler"]);
    this.url = new URL(WellKnown.WEB_KEYS, options.host);
  }

  public async getKeys(): Promise<Array<KeyPair>> {
    const start = Date.now();
    const url = this.url.toString();

    this.logger.debug("loading keys from host", { url });

    try {
      const response = await axios.get(url);
      const keys = response?.data?.keys;

      if (!keys || !keys.length) {
        throw new Error("No keys could be found");
      }

      const array: Array<KeyPair> = [];

      for (const key of keys) {
        array.push(
          new KeyPair({
            id: key.kid,
            algorithm: key.alg,
            created: new Date(key.c),
            expires: key.exp ? new Date(key.exp) : null,
            publicKey: key.n,
            type: key.kty,
          }),
        );
      }

      this.logger.debug("found keys from host", {
        result: { success: !!keys.length, amount: keys.length },
        time: Date.now() - start,
      });

      return array;
    } catch (err) {
      throw new WebKeyHandlerError(err, url);
    }
  }
}
