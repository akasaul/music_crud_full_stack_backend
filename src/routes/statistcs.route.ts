import { Router } from "express";
import * as statisticsController from "../controllers/statistics.controller";
import { ValidatorMiddleware } from "../middlewares/validate.middleware";

export const statistics = Router();
// const { validate } = new ValidatorMiddleware();

statistics.get("/overview", statisticsController.getOverview);
statistics.get("/songs-per-genre", statisticsController.getSongsPerGenre);
statistics.get(
  "/songs-albums-per-artist",
  statisticsController.getSongsAndAlbumsPerArtist,
);
statistics.get("/songs-per-album", statisticsController.getSongsPerAlbum);

statistics.get("/most-popular-genre", statisticsController.getMostPopularGenre);
statistics.get("/most-prolific-artist", statisticsController.getMostProlificArtist);
statistics.get("/most-popular-album", statisticsController.getMostPopularAlbum);
statistics.get("/average-songs-per-album", statisticsController.getAverageSongsPerAlbum);
statistics.get("/average-songs-per-artist", statisticsController.getAverageSongsPerArtist);
statistics.get("/latest-song", statisticsController.getLatestSong);
