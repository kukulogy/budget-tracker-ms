const toError = (
  err: unknown,
  fallback = "An unknown error occurred",
): Error => {
  if (err instanceof Error) return err;
  if (typeof err === "string") return new Error("An unknown error occurred");
  return new Error(fallback);
};

export { toError };
