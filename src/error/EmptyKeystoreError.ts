import { APIError, HttpStatus } from "@lindorm-io/core";

export class EmptyKeystoreError extends APIError {
  constructor() {
    super("Keystore was initialised without keys", {
      statusCode: HttpStatus.ServerError.INTERNAL_SERVER_ERROR,
    });
  }
}
