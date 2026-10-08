import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryItem extends Document {
  url: string;
  captionEn: string;
  captionFr: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    url: { type: String, required: true },
    captionEn: { type: String, default: '' },
    captionFr: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem ?? mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
