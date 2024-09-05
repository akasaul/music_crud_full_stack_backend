import { Schema, model } from "mongoose";
import { ISong } from "./song.model";

export interface IUser {
  name: string;
  password: string;
  email: string;
  role: string;
  favs: [Schema.Types.ObjectId] | [ISong];
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
    favs: {
      type: [Schema.Types.ObjectId],
      ref: "Song",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", UserSchema);
