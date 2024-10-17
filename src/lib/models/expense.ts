import { Schema, model, models } from "mongoose";

const ExpenseSchema = new Schema(
    {
        timestamp: {
            type: Schema.Types.Date,
        },
        amount: {
            type: Schema.Types.Decimal128,
            required: true,
        },
        description: {
            type: String,
        },
        property_id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },

    { collection: "expense" },
);

export const Expense = models?.expense || model("expense", ExpenseSchema);
