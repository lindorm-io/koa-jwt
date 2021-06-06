import { KoaContext } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";
import { Keystore } from "@lindorm-io/key-pair";

export interface TokenIssuerContext extends KoaContext {
  jwt: TokenIssuer;
  keystore: Keystore;
}
