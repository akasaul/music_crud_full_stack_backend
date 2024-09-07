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
        $lookup: {
          from: "users",
          let: { songId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$songId", "$favs"],
                },
              },
            },
          ],
          as: "favoritedByUser",
        },
      },
      {
        $addFields: {
          isFav: { $gt: [{ $size: "$favoritedByUser" }, 0] },
          isMySong: { $eq: ["$postedBy", userObjectId] },
        },
      },
      {
        $project: {
          favoritedByUser: 0,
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
    const userId = req.user?._id;

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
        $lookup: {
          from: "users",
          let: { songId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$songId", "$favs"],
                },
              },
            },
          ],
          as: "favoritedByUser",
        },
      },
      {
        $addFields: {
          isFav: { $gt: [{ $size: "$favoritedByUser" }, 0] },
        },
      },
      {
        $project: {
          favoritedByUser: 0,
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
    const songId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const songExists = await Song.findById(songId);
    if (!songExists) {
      return res.status(404).json({ message: "Song not found" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favs: songId } },
      { new: true },
    );

    res.status(200).json({ message: "Song added to favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const songId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const songExists = await Song.findById(songId);
    if (!songExists) {
      return res.status(404).json({ message: "Song not found" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { favs: songId } },
      { new: true },
    );

    res.status(200).json({ message: "Song removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFavoriteSongs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // Get user id from req.user

    if (!userId) {
      return res
        .status(400)
        .json({ error: true, message: "User not authenticated" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the user and get their favorite song IDs
    const user = await User.findById(userObjectId).select("favs").lean();
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const favSongIds = user.favs;

    // Find all songs that match the favorite IDs
    const favoriteSongs = await Song.find({ _id: { $in: favSongIds } });

    // Add the isFav field to each song
    const songsWithIsFav = favoriteSongs.map((song) => ({
      ...song.toObject(),
      isFav: true,
    }));

    res.status(200).json(songsWithIsFav);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const searchSongs = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    const searchCriteria = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
        { album: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    };

    const songs = await Song.find(searchCriteria);

    if (songs.length === 0) {
      return res
        .status(404)
        .json({ message: "No songs found matching the search criteria." });
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
