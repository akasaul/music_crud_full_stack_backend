import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export class ValidatorMiddleware {
  constructor() {}

  // This method validates both request parameters and body based on provided schemas
  validate(schemas: { params?: Joi.ObjectSchema; body?: Joi.ObjectSchema }) {
    return (req: Request, res: Response, next: NextFunction) => {
      let errors: unknown[] = [];

      // Validate params if schema is provided
      if (schemas.params) {
        const { error } = schemas.params.validate(req.params, {
          abortEarly: false,
        });
        if (error) {
          errors = errors.concat(error.details.map((detail) => detail.message));
        }
      }

      // Validate body if schema is provided
      if (schemas.body) {
        const { error } = schemas.body.validate(req.body, {
          abortEarly: false,
        });
        if (error) {
          errors = errors.concat(error.details.map((detail) => detail.message));
        }
      }

      // If there are any errors, respond with a 400 status code and the errors array
      if (errors.length > 0) {
        return res.status(400).json({
          errors,
        });
      }

      next();
    };
  }
}
