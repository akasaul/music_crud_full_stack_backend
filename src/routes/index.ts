import { Router, Request, Response } from "express";
import { user } from "./user.route";
import { song } from "./song.route";
import { statistics } from "./statistcs.route";

const routes = Router();

// Home route
routes.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Music Crud API project!");
});

// API routes
routes.use("/api/auth", user);
routes.use("/api/songs", song);
routes.use("/api/stats", statistics);

export default routes;
