import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class EmptyKeystoreError extends APIError {
  public constructor() {
    super("Keystore was initialised without keys", {
      statusCode: HttpStatus.ServerError.INTERNAL_SERVER_ERROR,
    });
  }
}
