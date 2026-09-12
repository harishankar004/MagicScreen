import { z } from 'zod';

export const BookingSchema = z.object({
  slotId:        z.number().min(1, 'Please select a time slot'),
  occasionId:    z.number().min(1, 'Please select an occasion'),
  totalGuests:   z.number().min(1),
  customerName:  z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email'),
  customerPhone: z.string().min(10, 'Please enter a valid phone number'),
});