import { getModelForClass, prop } from "@typegoose/typegoose";

class User {
  @prop()
  username!: string;
  @prop()
  email!: string;
  @prop()
  creationDate!: Date;
  @prop()
  salt!: string;
  @prop()
  hash!: string;
  @prop()
  token!: string;
}

export const UserModel = getModelForClass(User);
