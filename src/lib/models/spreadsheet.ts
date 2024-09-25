import { Schema, model, models } from "mongoose";

const SpreadsheetSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

export const Spreadsheet =
  models?.Spreadsheet || model("spreadsheet", SpreadsheetSchema);
