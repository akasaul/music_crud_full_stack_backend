import Joi from "joi";
import { objectId } from "./custom.validator";

export const createSongSchema = {
  body: Joi.object({
    title: Joi.string().required().trim(),
    artist: Joi.string().required().trim(),
    album: Joi.string().required().trim(),
    genre: Joi.string().required().trim(),
    coverImg: Joi.string().required().trim(),
    duration: Joi.number().required(),
  }),
};

export const updateSongSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object({
    title: Joi.string().optional().trim(),
    artist: Joi.string().optional().trim(),
    album: Joi.string().optional().trim(),
    genre: Joi.string().optional().trim(),
    coverImg: Joi.string().required().trim(),
    duration: Joi.number().optional(),
  }).min(1), // At least one field must be provided for update
};

export const getSongdetailsSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
};

export const listSongsSchema = {
  params: Joi.object({
    genre: Joi.string().optional().trim(),
    artist: Joi.string().optional().trim(),
  }),
  body: Joi.object({
    album: Joi.string().optional().trim(),
    page: Joi.number().integer().min(1).optional(), // for pagination
    limit: Joi.number().integer().min(1).optional(), // for pagination
  }),
};
