import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  password: string;
  email: string;
  role: string;
  words: Array<any>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", UserSchema);
