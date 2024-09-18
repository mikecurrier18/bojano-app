import { Schema, model, models } from "mongoose";

const OwnerSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      photo: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      propertyIds: [{
        type: Schema.Types.ObjectId,
        ref: "Property",
      }],
      
});

const Owner = models?.Owner || model("Owner", OwnerSchema);

export default Owner;