// import { getModelForClass, prop } from "@typegoose/typegoose";

// class User {
//   @prop()
//   username!: string;
//   @prop()
//   email!: string;
//   @prop()
//   creationDate!: Date;
//   @prop()
//   salt!: string;
//   @prop()
//   hash!: string;
//   @prop()
//   token!: string;
//   @prop()
//   validated!: boolean;
// }

// export const UserModel = getModelForClass(User);
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  creationDate: Date;
  salt: string;
  hash: string;
  token: string;
  validated: boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  creationDate: { type: Date, required: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  token: { type: String, required: true },
  validated: { type: Boolean },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export { UserModel };
