// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export class ValidatorMiddleware {
  // Constructor can be omitted or left empty
  constructor() {}

  validate(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          errors: error.details.map((detail) => detail.message),
        });
      }

      next();
    };
  }
}
