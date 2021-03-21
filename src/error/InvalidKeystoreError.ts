import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidKeystoreError extends APIError {
  constructor() {
    super("Keystore could not be found on context", {
      statusCode: HttpStatus.ServerError.INTERNAL_SERVER_ERROR,
    });
  }
}
