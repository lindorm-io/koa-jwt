import { KoaContext } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";

export interface TokenIssuerContext extends KoaContext {
  issuer: {
    [key: string]: TokenIssuer;
  };
  keystore: {
    [key: string]: Keystore;
  };
  logger: Logger;
}
