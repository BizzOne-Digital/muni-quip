import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  organization: string;
  email: string;
  phone: string;
  province: string;
  preferredDate: string;
  serviceType: string;
  equipment: string;
  message: string;
  language: 'en' | 'fr';
  status: 'new' | 'read' | 'contacted';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true },
    organization: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    province: { type: String, default: '' },
    preferredDate: { type: String, default: '' },
    serviceType: { type: String, default: '' },
    equipment: { type: String, default: '' },
    message: { type: String, default: '' },
    language: { type: String, enum: ['en', 'fr'], default: 'en' },
    status: { type: String, enum: ['new', 'read', 'contacted'], default: 'new' },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>('Booking', BookingSchema);
