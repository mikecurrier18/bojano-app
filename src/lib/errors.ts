/**
 * Convert a thrown exception into an instance of `Error` (if not already).
 */
export function convertToError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    } else if (typeof error === "string") {
        return new Error(error);
    } else {
        return new Error(JSON.stringify(error));
    }
}

/**
 * Base exception for all Bojano-related errors.
 */
export class BojanoError extends Error {}

/**
 * An error thrown when the API receives a year greater than the current year,
 * or if the year is not in 4-digit YYYY format.
 */
export class InvalidYearError extends BojanoError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidYearError";
    }
}

/**
 * An error thrown when the API receives a month that is outside of
 * the range [1...12], or if the month is not in 2-digit MM format.
 */
export class InvalidMonthError extends BojanoError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidMonthError";
    }
}

/**
 *
 */
export class PropertyNotFoundError extends Error {
    constructor(propertyId: string) {
        super(`property not found with id ${propertyId}`);
        this.name = "PropertyNotFoundError";
    }
}

/**
 *
 */
export class ExpenseSheetNotFoundError extends Error {
    constructor(year: string) {
        super(`expense sheet not found for year ${year}`);
        this.name = "ExpenseSheetNotFoundError";
    }
}

/**
 *
 */
export class SpreadsheetNotFoundError extends Error {
    constructor(propertyId: string) {
        super(`spreadsheet not found for property with id ${propertyId}`);
        this.name = "SpreadsheetNotFoundError";
    }
}

/**
 *
 */
export class SpreadsheetAccessError extends Error {
    constructor(spreadsheetUrl: string) {
        super(`expected access to spreadsheet at ${spreadsheetUrl}`);
        this.name = "SpreadsheetAccessError";
    }
}

export interface APIError {
    errors: string[];
}

export interface ClerkError {
    errors: Array<{ code: string; message: string; longMessage: string }>;
    meta: object;
}

export function isClerkError(error: any): error is ClerkError {
    return (
        "errors" in error &&
        error.errors !== undefined &&
        Array.isArray(error.errors)
    );
}
