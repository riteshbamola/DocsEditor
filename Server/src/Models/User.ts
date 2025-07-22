import mongoose from "mongoose";

export interface Iuser {
  name: string;
  email: string;
  password: string;
  updatedAt: Date;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<Iuser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Iuser>("User", userSchema);
