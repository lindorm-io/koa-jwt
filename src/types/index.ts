import { IKoaAppContext } from "@lindorm-io/koa";
import { TokenIssuer } from "@lindorm-io/jwt";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";

export type TNext = () => Promise<void>;

export interface IKoaTokenIssuerContext extends IKoaAppContext {
  issuer: {
    tokenIssuer: TokenIssuer;
  };
  keystore: Keystore;
  logger: Logger;
}

export interface ITokenIssuerMiddlewareOptions {
  issuer: string;
}
