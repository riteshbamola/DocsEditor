import express, { Router, Request, Response } from 'express';
import User from '../Models/User';
import { authenticateToken } from '../Middlewares/Auth';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userid: string;
  email: string;
}
interface AuthRequest extends Request {
  user?: {
    userid: string;
    email: string;
  };
}
const UserRoutes: Router = express.Router();

UserRoutes.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // Create and save new user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ msg: "Registered successfully" });
  } catch (err: any) {
    res.status(500).json({ msg: `Error registering user: ${err.message}` });
  }
});
UserRoutes.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "No user found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const payload: JwtPayload = {
      userid: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN as string, {
      expiresIn: '36000m',
    });

    return res.status(200).json({ msg: "Success", user, accessToken });
  } catch (err: any) {
    return res.status(500).json({ msg: `Error signing in: ${err.message}` });
  }
});
UserRoutes.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  const id = req.user?.userid;

  if (!id) {
    return res.status(400).json({ msg: "Invalid token payload" });
  }

  try {
    const userDetails = await User.findById(id).select('-password');

    if (!userDetails) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User fetched successfully", userDetails });
  } catch (err: any) {
    return res.status(500).json({ msg: `Error loading user: ${err.message}` });
  }
});
export default UserRoutes;
