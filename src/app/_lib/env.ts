/**
 * Thrown when a required environment variable is not defined.
 */
export class RequiredEnvError extends Error {
  constructor(key: string) {
    super(`environment variable '${key}' should be defined`);
    this.name = "RequiredEnvError";
  }
}

/**
 * Get the value of an environment variable, or throw if undefined.
 *
 * @throws {RequiredEnvError}
 */
export function getRequiredEnv(key: string): string {
  if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
    throw new RequiredEnvError(key);
  }
  return process.env[key] as string;
}

export const MONGODB_URL = getRequiredEnv("MONGODB_URL");
export const CLERK_SECRET_KEY = getRequiredEnv("CLERK_SECRET_KEY");
