import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();


interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader;

  if (!token) {
    res.status(400).json({ message: "Token not provided" });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, user) => {
    if (err) {
      console.log("User not generated");
      res.status(401).json({ msg: "Invalid or expired token" });
      return;
    }

    req.user = user;
    next();
  });
}
