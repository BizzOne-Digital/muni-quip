import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  organization: string;
  email: string;
  phone: string;
  message: string;
  language: 'en' | 'fr';
  status: 'new' | 'read' | 'contacted';
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    organization: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
    language: { type: String, enum: ['en', 'fr'], default: 'en' },
    status: { type: String, enum: ['new', 'read', 'contacted'], default: 'new' },
  },
  { timestamps: true }
);

export const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ??
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
