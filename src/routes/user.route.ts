import { Router } from "express";
import * as controller from "../controllers/user.controller";
import { ValidatorMiddleware } from "../middlewares/validate.middleware";
import { signupSchema, loginSchema } from "../validators/user.validator";

export const user = Router();
const { validate } = new ValidatorMiddleware();

user.post("/signup", validate(signupSchema), controller.signup);
user.post("/login", validate(loginSchema), controller.login);
user.post("/refresh", controller.refresh);
user.post("/validate", controller.validate);
