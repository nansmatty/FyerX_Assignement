import { z } from 'zod';

export const signupValidation = z.object({
	name: z.string().trim().min(2, 'Name must contain at least 2 characters'),
	email: z.email().trim().toLowerCase(),
	password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export type SignupValidation = z.infer<typeof signupValidation>;

export const loginValidation = z.object({
	email: z.email().trim().toLowerCase(),
	password: z.string().min(1, 'Password is required'),
});

export type LoginValidation = z.infer<typeof loginValidation>;
