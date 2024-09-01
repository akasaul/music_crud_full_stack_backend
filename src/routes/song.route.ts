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

export const song = Router();
const { validate } = new ValidatorMiddleware();

song.post("/", validate(createSongSchema), controller.createSong);

song.get("/", validate(listSongsSchema), controller.getSongs);

song.get("/:id", validate(getSongdetailsSchema), controller.getSongById);

song.put("/:id", validate(updateSongSchema), controller.updateSong);

song.delete("/:id", validate(getSongdetailsSchema), controller.deleteSong);
