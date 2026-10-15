import { z } from 'zod'

const email = z.string().trim().email('Enter a valid email address')
const password = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const registerSchema = z.object({
  name:z.string().trim().min(2,'Name must be at least 2 characters').max(80,'Name is too long'),
  email,
  password,
  phone:z.string().trim().regex(/^\+?[0-9]{10,15}$/,'Enter a valid phone number').optional().or(z.literal('')),
  role:z.enum(['USER','ADMIN']).default('USER')
})

export const loginSchema = z.object({
  email,
  password:z.string().min(1,'Password is required')
})

export const bookingSchema = z.object({
  resourceId:z.string().min(1,'Resource is required'),
  startAt:z.string().datetime(),
  endAt:z.string().datetime(),
  purpose:z.string().trim().min(3,'Purpose must be at least 3 characters').max(300,'Purpose is too long'),
  attendees:z.number().int().positive('Attendees must be at least 1')
})
