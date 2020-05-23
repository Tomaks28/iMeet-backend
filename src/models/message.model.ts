import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  createdAt: Date;
  message: string;
}

const MessageSchema: Schema = new Schema({
  from: { type: Schema.Types.ObjectId, required: true },
  to: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true },
  message: { type: String, required: true },
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export { MessageModel };
