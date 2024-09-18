import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema({
    propertyId: {
        type: String,
        required: true,
        unique: true,
      },
      airBnbId: {
        type: String,
        required: true,
        unique: true,
      },
      airBnbUrl: {
        type: String,
        required: true,
        unique: true,
      },
      vrboId: {
        type: String,
        required: true,
        unique: true,
      },
      vrboUrl: {
        type: String,
        required: true,
        unique: true,
      },
      propertyOwner: {
        type: Schema.Types.ObjectId,
          ref: "Owner",
        required: true,
      },
      expenseIds: [{
        type: Schema.Types.ObjectId,
        ref: "Expense",
      }],
      
});

const Property = models?.Property || model("Property", PropertySchema);

export default Property;