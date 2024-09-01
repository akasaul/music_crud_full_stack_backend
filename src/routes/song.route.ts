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

// Create a new song
song.post("/", validate(createSongSchema), controller.createSong);

// Get all songs (with optional filters and pagination)
song.get("/", validate(listSongsSchema), controller.getSongs);

// Get a single song by ID
song.get("/:id", validate(getSongdetailsSchema), controller.getSongById);

// Update a song by ID
song.put("/:id", validate(updateSongSchema), controller.updateSong);

// Delete a song by ID
song.delete("/:id", validate(getSongdetailsSchema), controller.deleteSong);
