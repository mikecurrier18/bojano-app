/**
 * Base exception for all Bojano-related errors.
 */
class BojanoException extends Error {}

/**
 * An error thrown when the API receives a year greater than the current year,
 * or if the year is not in 4-digit YYYY format.
 */
class InvalidYearError extends BojanoException {
  constructor(message: string) {
    super(message);
    this.name = "InvalidYearError";
  }
}

/**
 * An error thrown when the API receives a month that is outside of
 * the range [1...12], or if the month is not in 2-digit MM format.
 */
class InvalidMonthError extends BojanoException {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMonthError";
  }
}
