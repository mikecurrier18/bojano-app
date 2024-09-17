import { NextResponse } from "next/server";

type Params = {
  params: {};
};

/**
 * Get a user's monthly expenses.
 *
 * @param {Request} request
 * @param {Params} params
 */
export async function GET(request: Request, { params }: Params) {
  return NextResponse.json({});
}
