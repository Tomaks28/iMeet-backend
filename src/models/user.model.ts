import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  id: Schema.Types.ObjectId;
  reaction: Boolean;
}

export interface IUser extends Document {
  email: string;
  username: string;
  creationDate: Date;
  salt: string | undefined;
  hash: string | undefined;
  token: string;
  validated: boolean;
  online: boolean;
  lastConnexion: Date;
  gender: "MALE" | "FEMALE";
  pictures: Array<{ url: string; public_id: string }>;
  likes: Array<IMatch>;
  dislikes: Array<IMatch>;
  matchRequests: Array<IMatch>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  creationDate: { type: Date, required: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  token: { type: String, required: true },
  validated: { type: Boolean },
  online: { type: Boolean },
  lastConnexion: { type: Date },
  gender: { type: String },
  pictures: [{ url: String, public_id: String }],
  likes: [{ id: Schema.Types.ObjectId, reaction: Boolean }],
  dislikes: [{ id: Schema.Types.ObjectId, reaction: Boolean }],
  matchRequests: [{ id: Schema.Types.ObjectId, reaction: Boolean }],
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
