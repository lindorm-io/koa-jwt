import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidKeystoreError extends APIError {
  public constructor() {
    super("Keystore could not be found on context", {
      statusCode: HttpStatus.ServerError.INTERNAL_SERVER_ERROR,
    });
  }
}
