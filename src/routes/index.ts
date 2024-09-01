import { Router, Request, Response } from "express";
import { user } from "./user.route";

const routes = Router();

// Home route
routes.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Music Crud API project!");
});

// API routes
routes.use("/api/auth", user);

export default routes;
