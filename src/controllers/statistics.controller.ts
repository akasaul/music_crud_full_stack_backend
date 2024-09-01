import { Request, Response } from "express";
import { Song } from "../models/song.model";

// export const getOverview = async (req: Request, res: Response) => {
//   try {
//     // Total number of songs
//     const totalSongs = await Song.countDocuments();
//
//     // Total number of unique artists
//     const totalArtists = await Song.aggregate([
//       { $group: { _id: "$artist" } },
//       { $count: "total" },
//     ]);
//     const artistCount = totalArtists.length > 0 ? totalArtists[0].total : 0;
//
//     // Total number of unique albums
//     const totalAlbums = await Song.aggregate([
//       { $group: { _id: "$album" } },
//       { $count: "total" },
//     ]);
//     const albumCount = totalAlbums.length > 0 ? totalAlbums[0].total : 0;
//
//     // Total number of unique genres
//     const totalGenres = await Song.aggregate([
//       { $group: { _id: "$genre" } },
//       { $count: "total" },
//     ]);
//     const genreCount = totalGenres.length > 0 ? totalGenres[0].total : 0;
//
//     res.json({
//       totalSongs,
//       totalArtists: artistCount,
//       totalAlbums: albumCount,
//       totalGenres: genreCount,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch overview statistics" });
//   }
// };

export const getSongsPerGenre = async (req: Request, res: Response) => {
  try {
    const genres = await Song.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $project: { genre: "$_id", count: 1, _id: 0 } },
    ]);

    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch songs per genre" });
  }
};

export const getSongsAndAlbumsPerArtist = async (
  req: Request,
  res: Response,
) => {
  try {
    const artists = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          songsCount: { $sum: 1 },
          albums: { $addToSet: "$album" },
        },
      },
      {
        $project: {
          artist: "$_id",
          songsCount: 1,
          albumsCount: { $size: "$albums" },
          _id: 0,
        },
      },
    ]);

    res.json(artists);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch songs and albums per artist" });
  }
};

export const getSongsPerAlbum = async (req: Request, res: Response) => {
  try {
    const albums = await Song.aggregate([
      { $group: { _id: "$album", songsCount: { $sum: 1 } } },
      { $project: { album: "$_id", songsCount: 1, _id: 0 } },
    ]);

    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch songs per album" });
  }
};

export const getOverview = async (req: Request, res: Response) => {
  try {
    const totalSongs = await Song.countDocuments();

    const totalArtists = await Song.aggregate([
      { $group: { _id: "$artist" } },
      { $count: "total" },
    ]);
    const artistCount = totalArtists.length > 0 ? totalArtists[0].total : 0;

    const totalAlbums = await Song.aggregate([
      { $group: { _id: "$album" } },
      { $count: "total" },
    ]);
    const albumCount = totalAlbums.length > 0 ? totalAlbums[0].total : 0;

    const totalGenres = await Song.aggregate([
      { $group: { _id: "$genre" } },
      { $count: "total" },
    ]);
    const genreCount = totalGenres.length > 0 ? totalGenres[0].total : 0;

    res.json({
      totalSongs,
      totalArtists: artistCount,
      totalAlbums: albumCount,
      totalGenres: genreCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch overview statistics" });
  }
};

export const getMostPopularGenre = async (req: Request, res: Response) => {
  try {
    const mostPopularGenre = await Song.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const popularGenre =
      mostPopularGenre.length > 0
        ? mostPopularGenre[0]
        : { _id: "N/A", count: 0 };
    res.json({ genre: popularGenre._id, count: popularGenre.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch most popular genre" });
  }
};

export const getMostProlificArtist = async (req: Request, res: Response) => {
  try {
    const mostProlificArtist = await Song.aggregate([
      { $group: { _id: "$artist", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const prolificArtist =
      mostProlificArtist.length > 0
        ? mostProlificArtist[0]
        : { _id: "N/A", count: 0 };
    res.json({ artist: prolificArtist._id, count: prolificArtist.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch most prolific artist" });
  }
};

export const getMostPopularAlbum = async (req: Request, res: Response) => {
  try {
    const mostPopularAlbum = await Song.aggregate([
      { $group: { _id: "$album", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const popularAlbum =
      mostPopularAlbum.length > 0
        ? mostPopularAlbum[0]
        : { _id: "N/A", count: 0 };
    res.json({ album: popularAlbum._id, count: popularAlbum.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch most popular album" });
  }
};

export const getAverageSongsPerAlbum = async (req: Request, res: Response) => {
  try {
    const averageSongsPerAlbum = await Song.aggregate([
      { $group: { _id: "$album", count: { $sum: 1 } } },
      { $group: { _id: null, average: { $avg: "$count" } } },
    ]);
    const avgSongsPerAlbum =
      averageSongsPerAlbum.length > 0 ? averageSongsPerAlbum[0].average : 0;
    res.json({ averageSongsPerAlbum: avgSongsPerAlbum });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch average songs per album" });
  }
};

export const getAverageSongsPerArtist = async (req: Request, res: Response) => {
  try {
    const averageSongsPerArtist = await Song.aggregate([
      { $group: { _id: "$artist", count: { $sum: 1 } } },
      { $group: { _id: null, average: { $avg: "$count" } } },
    ]);
    const avgSongsPerArtist =
      averageSongsPerArtist.length > 0 ? averageSongsPerArtist[0].average : 0;
    res.json({ averageSongsPerArtist: avgSongsPerArtist });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch average songs per artist" });
  }
};

export const getLatestSong = async (req: Request, res: Response) => {
  try {
    const latestSong = await Song.findOne().sort({ createdAt: -1 });
    res.json({ latestSong: latestSong ? latestSong.title : "N/A" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest song" });
  }
};
