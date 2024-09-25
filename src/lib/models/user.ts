// import { Schema, model, models } from "mongoose";
//
// const UserSchema = new Schema({
//   _id: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//   },
//   emailAddresses: [
//     {
//       type: String,
//       required: true,
//       unique: true,
//     },
//   ],
//   phoneNumbers: [
//     {
//       type: String,
//     },
//   ],
//   photo: {
//     type: String,
//   },
//   property: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "property",
//     },
//   ],
// });
//
// export const User = models?.User || model("user", UserSchema);
