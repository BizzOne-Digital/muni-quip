import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  titleEn: string;
  titleFr: string;
  slug: string;
  headlineEn: string;
  headlineFr: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  fullContentEn: string;
  fullContentFr: string;
  image: string;
  icon: string;
  ctaEn: string;
  ctaFr: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    titleEn: { type: String, required: true },
    titleFr: { type: String, default: '' },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    headlineEn: { type: String, default: '' },
    headlineFr: { type: String, default: '' },
    shortDescriptionEn: { type: String, default: '' },
    shortDescriptionFr: { type: String, default: '' },
    fullContentEn: { type: String, default: '' },
    fullContentFr: { type: String, default: '' },
    image: { type: String, default: '' },
    icon: { type: String, default: 'gear' },
    ctaEn: { type: String, default: 'Explore Solutions' },
    ctaFr: { type: String, default: 'Explorer les solutions' },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  mongoose.models.Service ?? mongoose.model<IService>('Service', ServiceSchema);
