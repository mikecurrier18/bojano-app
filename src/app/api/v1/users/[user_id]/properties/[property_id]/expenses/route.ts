import { NextRequest } from "next/server";

import { z } from "zod";

const ExpenseSchema = z.object({
    amount: z.number(),
    description: z.string(),
    timestamp: z.date().default(new Date()),
    receipt_link: z.string(),
    merchant: z.string(),
    buyers_name: z.string(),
});

/**
 * An HTTP endpoint for creating new property expenses.
 *
 * @example
 * // Create a new expense
 * fetch(`/api/users/${userId}/properties/${propertyId}/expenses`, {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({
 *     amount: 160.00,
 *     description: "Pool service",
 *     timestamp: new Date().toISOString(),
 *     receipt_link: receiptLink,
 *     merchant: "CompanyName Pool Service",
 *     buyers_name: "Employee Name",
 *   }),
 * });
 */
export async function POST(_request: NextRequest) {}

// TODO: Return an object like:
// [
//   {
//     "id": 0,
//     "amount": 160.00,
//     "description": "Pool service",
//     "timestamp": "2024-01-03T9:49:46.000Z",
//     "receipt_link": "<link-to-image>",
//     "merchant": "CompanyName Pool Service",
//     "buyers_name": "Employee Name",
//   },
//   { ... }
// ]
//
// You can filter using query parameters

export async function GET(_request: NextRequest) {
    // Get ID from endpoint or database call
    // Get rows from expense sheet
    // Filter rows by property name
}
