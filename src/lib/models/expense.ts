import { Schema, model, models } from "mongoose";

const ExpenseSchema = new Schema({
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
  property: {
    type: Schema.Types.ObjectId,
    ref: "property",
    required: true,
  },
});

export const Expense = models?.Expense || model("expense", ExpenseSchema);
