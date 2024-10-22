import { Schema, model, models } from "mongoose";

const ExpenseSheetSchema = new Schema(
    {
        _id: {
            type: String,
            unique: true,
            required: true,
        },
        year: {
            type: Number,
            unique: true,
            required: true,
        },
    },
    { collection: "expense_sheet" },
);

export const ExpenseSheet =
    models?.expense_sheet || model("expense_sheet", ExpenseSheetSchema);
