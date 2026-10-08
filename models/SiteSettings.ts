import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  taglineEn: string;
  taglineFr: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  serviceAreaEn: string;
  serviceAreaFr: string;
  logo: string;
  footerTextEn: string;
  footerTextFr: string;
  socialFacebook: string;
  socialLinkedin: string;
  socialTwitter: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'MUNI-QUIP' },
    taglineEn: { type: String, default: 'Reliable Municipal Solutions' },
    taglineFr: { type: String, default: 'Solutions Municipales Fiables' },
    phone: { type: String, default: '613-930-6924' },
    email: { type: String, default: 'matt@muni-quip.ca' },
    address: { type: String, default: '841 Sydney Street, Suite 7-313' },
    city: { type: String, default: 'Cornwall' },
    province: { type: String, default: 'ON' },
    postalCode: { type: String, default: 'K6H 7L2' },
    serviceAreaEn: { type: String, default: 'Ontario and Quebec' },
    serviceAreaFr: { type: String, default: 'Ontario et Québec' },
    logo: { type: String, default: '' },
    footerTextEn: { type: String, default: 'Reliable Equipment. Stronger Communities.' },
    footerTextFr: { type: String, default: 'Équipements fiables. Communautés plus fortes.' },
    socialFacebook: { type: String, default: '' },
    socialLinkedin: { type: String, default: '' },
    socialTwitter: { type: String, default: '' },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
