import { NextFunction, Request, Response } from "express";
import { JwtService } from "../services/jwt.service";
import { JwtPayload } from "jsonwebtoken";

declare module "express" {
  export interface Request {
    user?: {
      _id: string;
      email: string;
    } & JwtPayload;
  }
}

interface DecodedToken extends JwtPayload {
  _id: string;
  email: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extracts the token part

  const decodedToken = JwtService.verify(token, "access");

  if (!decodedToken) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = decodedToken as DecodedToken;
  next();
};
export default auth;
