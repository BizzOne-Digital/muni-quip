import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageContent extends Document {
  pageKey: string; // 'home' | 'about' | 'contact' | 'booking'
  heroHeadingEn: string;
  heroHeadingFr: string;
  heroDescriptionEn: string;
  heroDescriptionFr: string;
  heroCta1En: string;
  heroCta1Fr: string;
  heroCta2En: string;
  heroCta2Fr: string;
  heroImage: string;
  section1HeadingEn: string;
  section1HeadingFr: string;
  section1TextEn: string;
  section1TextFr: string;
  seoTitleEn: string;
  seoTitleFr: string;
  seoDescriptionEn: string;
  seoDescriptionFr: string;
  blocks: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    pageKey: { type: String, required: true, unique: true },
    heroHeadingEn: { type: String, default: '' },
    heroHeadingFr: { type: String, default: '' },
    heroDescriptionEn: { type: String, default: '' },
    heroDescriptionFr: { type: String, default: '' },
    heroCta1En: { type: String, default: '' },
    heroCta1Fr: { type: String, default: '' },
    heroCta2En: { type: String, default: '' },
    heroCta2Fr: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    section1HeadingEn: { type: String, default: '' },
    section1HeadingFr: { type: String, default: '' },
    section1TextEn: { type: String, default: '' },
    section1TextFr: { type: String, default: '' },
    seoTitleEn: { type: String, default: '' },
    seoTitleFr: { type: String, default: '' },
    seoDescriptionEn: { type: String, default: '' },
    seoDescriptionFr: { type: String, default: '' },
    blocks: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const PageContent: Model<IPageContent> =
  mongoose.models.PageContent ?? mongoose.model<IPageContent>('PageContent', PageContentSchema);
