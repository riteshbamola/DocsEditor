import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  content: string;
  users: string[];
  updatedAt: Date;
  createdAt: Date;
}

const DocumentSchema: Schema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    users: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);
