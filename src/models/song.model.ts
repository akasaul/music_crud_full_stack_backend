import { Schema, model } from "mongoose";
import { IUser } from "./user.model";

export interface ISong {
  title: string;
  artist: string;
  album: string;
  genre: string;
  coverImg: string;
  duration: Number;
  postedBy: Schema.Types.ObjectId | IUser;
}

const SongSchema = new Schema<ISong>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    coverImg: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      trim: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Song = model<ISong>("Song", SongSchema);
