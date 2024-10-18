import { NextRequest, NextResponse } from "next/server";

/**
 * An HTTP endpoint for getting a property's reservations for a given year.
 *
 * @example
 * // Get a list of reservations for a given year
 * fetch();
 */
export async function GET(request: NextRequest) {
    const months = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
    ];

    const payload = [];

    for (let i = 0; i < months.length; ++i) {
        const month = months[i];
        const url = `${request.url}/${month}`;
        console.debug(`Sending GET request to: ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            console.error(data);
            payload.push([]);
        } else {
            payload.push(data);
        }
    }

    return NextResponse.json(payload);
}
