import { Schema, model } from "mongoose";

interface ISong {
  title: string;
  artist: string;
  album: string;
  genre: string;
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
  },
  {
    timestamps: true,
  },
);

export const Song = model<ISong>("Song", SongSchema);
