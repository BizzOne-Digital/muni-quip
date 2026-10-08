import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  nameEn: string;
  nameFr: string;
  slug: string;
  subtitleEn: string;
  subtitleFr: string;
  category: string; // service slug, e.g. 'asphalt-repair'
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  fullDescriptionEn: string;
  fullDescriptionFr: string;
  benefitsEn: string[];
  benefitsFr: string[];
  applicationsEn: string[];
  applicationsFr: string[];
  specifications: { key: string; value: string }[];
  heroImage: string;
  galleryImages: string[];
  brand: string;
  price: string; // only shown when admin explicitly enters one
  sortOrder: number;
  featured: boolean;
  published: boolean;
  seoTitleEn: string;
  seoTitleFr: string;
  seoDescriptionEn: string;
  seoDescriptionFr: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    nameEn: { type: String, required: true },
    nameFr: { type: String, default: '' },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subtitleEn: { type: String, default: '' },
    subtitleFr: { type: String, default: '' },
    category: { type: String, default: 'asphalt-repair' },
    shortDescriptionEn: { type: String, default: '' },
    shortDescriptionFr: { type: String, default: '' },
    fullDescriptionEn: { type: String, default: '' },
    fullDescriptionFr: { type: String, default: '' },
    benefitsEn: { type: [String], default: [] },
    benefitsFr: { type: [String], default: [] },
    applicationsEn: { type: [String], default: [] },
    applicationsFr: { type: [String], default: [] },
    specifications: { type: [{ key: String, value: String, _id: false }], default: [] },
    heroImage: { type: String, default: '' },
    galleryImages: { type: [String], default: [] },
    brand: { type: String, default: '' },
    price: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    seoTitleEn: { type: String, default: '' },
    seoTitleFr: { type: String, default: '' },
    seoDescriptionEn: { type: String, default: '' },
    seoDescriptionFr: { type: String, default: '' },
  },
  { timestamps: true }
);

ProductSchema.index({ featured: 1, published: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
