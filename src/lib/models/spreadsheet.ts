import { Schema, model, models } from "mongoose";

const SpreadsheetSchema = new Schema(
    {
        _id: {
            type: String,
            unique: true,
            required: true,
        },
        property_id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
    },
    { collection: "spreadsheet" },
);

export const Spreadsheet =
    models?.spreadsheet || model("spreadsheet", SpreadsheetSchema);
