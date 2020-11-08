import { ExtendableError } from "@lindorm-io/core";

export class WebKeyHandlerError extends ExtendableError {
  constructor(error: Error, url: string) {
    super("Unable to find JWKS on URL", {
      debug: { error, url },
    });
  }
}
