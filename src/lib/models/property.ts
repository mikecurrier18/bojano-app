import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        airbnb_id: {
            type: String,
        },
        vrbo_id: {
            type: String,
        },
    },
    { collection: "property" },
);

export const Property = models?.property || model("property", PropertySchema);
