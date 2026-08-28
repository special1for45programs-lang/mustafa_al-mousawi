import { z } from 'zod';

export const LogoDetailsSchema = z.object({
  favoriteColors: z.string().optional(),
  inspirationImage: z.string().optional(),
  designStyle: z.string().optional(),
  logoType: z.union([
    z.literal('text'),
    z.literal('symbolic'),
    z.literal('innovative'),
    z.literal('double'),
    z.literal('arabic'),
    z.literal('')
  ]).optional(),
  moodboard: z.array(z.string()).optional(),
  applications: z.record(z.string(), z.boolean()).optional(),
  otherApplication: z.string().optional(),
  paperSizes: z.object({
    dl: z.boolean(),
    a5: z.boolean(),
    a4: z.boolean(),
    a3: z.boolean(),
  }).optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string().optional(),
}).passthrough();

export const SocialDetailsSchema = z.object({
  favoriteColors: z.string().optional(),
  inspirationImage: z.string().optional(),
  inspirationImages: z.array(z.string()).optional(),
  designStyle: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  businessType: z.string().optional(),
  productsServices: z.string().optional(),
  postsList: z.array(z.object({
    category: z.string(),
    customCategory: z.string().optional(),
    headline: z.string(),
    concept: z.string(),
  })).optional(),
  visualStyle: z.union([
    z.literal('modern'),
    z.literal('formal'),
    z.literal('luxury'),
    z.literal('bold'),
    z.literal('')
  ]).optional(),
  additionalNotes: z.string().optional(),
}).passthrough();

// Crucial: we make sure that the base fields required for communication are mandatory,
// but they can be empty strings in the type if not filled initially.
// For safe parsing on submit, we require name, phone, etc.
export const BriefFormDataSchema = z.object({
  clientStatus: z.union([z.literal('new'), z.literal('current')]),
  date: z.string().optional(),
  clientName: z.string().min(2, 'يرجى إدخال اسم العميل بشكل صحيح'),
  companyName: z.string().optional(),
  phone: z.string().min(6, 'يرجى إدخال رقم هاتف صحيح'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal('')),
  
  projectName: z.string().optional(),
  projectDescription: z.string().optional(),
  projectType: z.string().optional(),
  
  briefCategory: z.union([
    z.literal('logo'),
    z.literal('branding'),
    z.literal('social_posts'),
    z.literal('social_plans'),
    z.literal('')
  ]).optional(),
  selectedPackageName: z.string().optional(),
  selectedPackagePrice: z.number().optional(),

  briefType: z.union([z.literal('logo'), z.literal('social'), z.literal('')]).optional(),
  logoDetails: LogoDetailsSchema.optional(),
  socialDetails: SocialDetailsSchema.optional(),
  
  designStyleImageBase64: z.string().optional(),
  designStyleName: z.string().optional(),
  logoTypeImageBase64: z.array(z.string()).optional(),
  logoTypeImagesBase64: z.array(z.string()).optional(),
  logoTypeName: z.string().optional(),
  logoTypeDesc: z.string().optional(),
  telegramFileIds: z.array(z.string()).optional(),
}).passthrough();
