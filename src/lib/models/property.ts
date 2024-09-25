import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    airbnbId: {
        type: String,
        required: true,
        unique: true,
    },
    vrboId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    // Removing the user collection since we can fetch directly from Clerk
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    //   required: true,
    // },
    expenses: [
        {
            type: Schema.Types.ObjectId,
            ref: "expense",
        },
    ],
});

export const Property = models?.Property || model("property", PropertySchema);
