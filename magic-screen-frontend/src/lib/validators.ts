import { z } from 'zod';

export const OccasionSchema = z.object({
  occasion: z.enum([
    'birthday', 'anniversary', 'proposal', 'date', 'match_screening', 
    'bride_to_be', 'mom_to_be', 'baby_shower', 'farewell', 
    'marriage_proposal', 'private_date', 'date_night', 'movie_night', 'reunion', 'other'
  ]),
  // Raised validation limit from 20 to 30 characters cleanly
  occasion_name: z.string().max(30, 'Occasion description must be under 30 characters.').optional(),
});

export const BookingDetailsSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters.').max(100),
  customer_phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'),
  customer_email: z.string().email('Enter a valid email address.').optional().or(z.literal('')),
  coupon_code: z.string().optional(),
  referral_code: z.string().optional(),
});

export const PhoneSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number.'),
});

export const OtpSchema = z.object({
  otp: z.string().length(6, 'Verification PIN must be exactly 6 digits.'),
});