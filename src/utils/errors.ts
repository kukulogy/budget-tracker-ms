class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly expose = true,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = "Invalid email or password") {
    super(401, "UNAUTHORIZED", message);
  }
}

class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, "CONFLICT", message);
  }
}

const toError = (
  err: unknown,
  fallback = "An unknown error occurred",
): Error => {
  if (err instanceof Error) return err;
  if (typeof err === "string") return new Error(err);
  return new Error(fallback);
};

const toHttpError = (
  err: unknown,
  fallbackCode = "INTERNAL_SERVER_ERROR",
): HttpError => {
  if (err instanceof HttpError) return err;

  return new HttpError(
    500,
    fallbackCode,
    "An unexpected error occurred",
    false,
  );
};

export { ConflictError, HttpError, UnauthorizedError, toError, toHttpError };
