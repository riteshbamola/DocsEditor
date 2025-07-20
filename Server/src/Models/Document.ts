import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  docId: string;
  title: string;
  content: string;
  users: string[];
  updatedAt: Date;
  createdAt: Date;
}

const DocumentSchema: Schema = new Schema<IDocument>(
  {
    docId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    users: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);
