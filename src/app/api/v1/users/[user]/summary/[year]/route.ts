import { NextResponse } from "next/server";

import { StatusCode } from "@/lib/http";

type AnnualSummary = {
  homeownerName: string;
  year: number;
};

/**
 * API endpoint for getting a user's annual summary.
 *
 * @example <caption>calculating the annual net profit</caption>
 * async function getAnnualSummary() {
 *   const url = "http://127.0.0.1:3000/api/v1/users/0/summary/2024";
 *   const response = await fetch(url);
 *   const body = await response.json();
 *   const data = body.data;
 *   const total = 0;
 *
 *   for (let i = 0; i < data.length; ++i) {
 *     const entry = data[i];
 *     total += entry.netProfit;
 *   }
 *
 *   console.log(total);
 * }
 */
export async function GET(request: Request) {
  console.error("user validation has not been implemented");

  const data: Array<undefined> = [];

  for (let i = 1; i <= 12; ++i) {
    const month = i.toString().length < 2 ? `0${i}` : i.toString();
    /**
     * server side does not have access to the browser's origin or base URL,
     * so you have to use absolute paths
     *
     * this means this endpoint won't work if you're using `localhost`,
     * you have to use the equivalent `127.0.0.1` instead, or `0.0.0.0`
     *
     * I believe Next.js uses `localhost` by default, so we have to run with:
     *
     *     npx next dev --host 0.0.0.0
     */
    const response = await fetch(`${request.url}/${month}`);

    console.assert(response.status !== 404, "invalid month in for loop");
    if (response.status === 400) {
      continue;
    }

    const body = await response.json();
    const monthData = body.data;
    data.push(monthData);
  }

  if (data.length === 0) {
    return NextResponse.json(
      { error: "no data found for the provided year" },
      { status: StatusCode.NOT_FOUND },
    );
  }

  return NextResponse.json({ data }, { status: 200 });
}
