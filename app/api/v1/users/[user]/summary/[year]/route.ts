import { NextResponse } from "next/server";

type AnnualSummary = {
  homeownerName: string;
  year: number;
};

/**
 * Get a user's annual summary.
 */
export async function GET(
  request: Request,
  { params }: { params: { user: string; year: string } },
) {
  console.log(request);
  console.log(params);

  // todo: validate user--how are we identifying users? email? uuid?
  console.error("user has not been validated (unimplemented)");

  const data: Array<undefined> = [];

  for (let i = 1; i <= 12; ++i) {
    const month = i.toString().length < 2 ? `0${i}` : i.toString();
    const monthData = await fetch(`${request.url}/${month}`);

    console.assert(monthData.status !== 404, "invalid month from for loop");
    if (monthData.status === 400) {
      continue;
    }

    data.push(await monthData.json());
  }

  if (data.length === 0) {
    return NextResponse.json(
      { error: "No data found for the provided year" },
      { status: 404 },
    );
  }

  return NextResponse.json(data, { status: 200 });
}
