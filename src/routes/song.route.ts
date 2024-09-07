// src/routes/song.routes.ts
import { Router } from "express";
import * as controller from "../controllers/song.controller";
import { ValidatorMiddleware } from "../middlewares/validate.middleware";
import {
  createSongSchema,
  listSongsSchema,
  getSongdetailsSchema,
  updateSongSchema,
} from "../validators/song.validator";
import auth from "../middlewares/auth.middleware";

export const song = Router();
const { validate } = new ValidatorMiddleware();

song.post("/", auth, validate(createSongSchema), controller.createSong);

song.get("/favorites", auth, controller.getFavoriteSongs);

song.post("/:id/add-to-favorite", auth, controller.addFavorite);

song.post("/:id/remove-from-favorite", auth, controller.removeFavorite);

song.get(
  "/library/my-songs",
  auth,
  validate(listSongsSchema),
  controller.getMySongs,
);

song.get("/search", controller.searchSongs);

song.get("/library", auth, validate(listSongsSchema), controller.getLibrary);

song.get("/", validate(listSongsSchema), controller.getSongs);

song.get("/:id", validate(getSongdetailsSchema), controller.getSongById);

song.put("/:id", validate(updateSongSchema), controller.updateSong);

song.delete("/:id", validate(getSongdetailsSchema), controller.deleteSong);
