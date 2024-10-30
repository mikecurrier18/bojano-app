import { InvalidMonthError, InvalidYearError } from "@/lib/errors";

/**
 * Ensure year is 4 digits long, and is not greater than the current year.
 *
 * @throws {InvalidYearError}
 */
export function convertYearStringToInt(year: string) {
    const value = parseInt(year, 10);

    if (isNaN(value) || year.length !== 4) {
        throw new InvalidYearError("year should be in 4-digit YYYY format");
    }

    const currentYear = new Date().getFullYear();

    if (value > currentYear) {
        throw new InvalidYearError(
            `year should be less than or equal to ${currentYear}`,
        );
    }

    return value;
}

/**
 * Convert a 2-digit, MM formatted month into its full month name.
 *
 * @throws {InvalidMonthError}
 *
 * @example
 * // returns "February"
 * convertMMToFullMonthName("02");
 */
export function convertMMToFullMonthName(month: string) {
    switch (month) {
        case "01":
            return "January" as const;
        case "02":
            return "February" as const;
        case "03":
            return "March" as const;
        case "04":
            return "April" as const;
        case "05":
            return "May" as const;
        case "06":
            return "June" as const;
        case "07":
            return "July" as const;
        case "08":
            return "August" as const;
        case "09":
            return "September" as const;
        case "10":
            return "October" as const;
        case "11":
            return "November" as const;
        case "12":
            return "December" as const;
        default:
            throw new InvalidMonthError(
                "month should be a 2-digit string between 01 and 12 (inclusive)",
            );
    }
}
