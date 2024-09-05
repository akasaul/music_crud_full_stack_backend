import { Request, Response } from "express";
import { Song } from "../models/song.model";
import mongoose from "mongoose";
import { User } from "../models/user.model";

export const createSong = async (req: Request, res: Response) => {
  try {
    const song = new Song({ postedBy: req.user?._id, ...req.body });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getSongs = async (req: Request, res: Response) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getLibrary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // Get user id from req.user

    if (!userId) {
      return res
        .status(400)
        .json({ error: true, message: "User not authenticated" });
    }

    // Convert userId to ObjectId for MongoDB comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const songs = await Song.aggregate([
      {
        $addFields: {
          isMySong: { $eq: ["$postedBy", userObjectId] },
        },
      },
    ]);

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getMySongs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // Get user id from req.user

    if (!userId) {
      return res
        .status(400)
        .json({ error: true, message: "User not authenticated" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const songs = await Song.aggregate([
      {
        $match: {
          postedBy: userObjectId,
        },
      },
      {
        $addFields: {
          isMySong: true,
        },
      },
    ]);

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getSongById = async (req: Request, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const updateSong = async (req: Request, res: Response) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { songId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the song exists
    const songExists = await Song.findById(songId);
    if (!songExists) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Add song to the user's favorites
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favs: songId } }, // $addToSet prevents duplicates
      { new: true },
    );

    res.status(200).json({ message: "Song added to favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove a song from favorites
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { songId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the song exists
    const songExists = await Song.findById(songId);
    if (!songExists) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Remove song from the user's favorites
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favs: songId } }, // $pull removes the song from the array
      { new: true },
    );

    res.status(200).json({ message: "Song removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
