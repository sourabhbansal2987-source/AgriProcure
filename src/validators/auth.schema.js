'use strict';

const { z } = require('zod');

const phone = z.preprocess((value) => String(value ?? '').replace(/\D/g, ''), z.string().regex(/^[0-9]{10,15}$/, 'Enter a valid mobile number, including country code when used.'));
const password = z.string().min(10).max(128).regex(/[a-z]/, 'Password requires a lowercase letter.').regex(/[A-Z]/, 'Password requires an uppercase letter.').regex(/[0-9]/, 'Password requires a number.');
const noUnknown = (shape) => z.object(shape).strict();

const registrationRequestSchema = noUnknown({
  fullName: z.string().trim().min(2).max(120), phone, password,
  village: z.string().trim().max(100).optional().default(''),
  district: z.string().trim().min(2).max(100), state: z.string().trim().min(2).max(100),
  preferredLanguage: z.enum(['en', 'hi']).default('en')
});
const otpVerificationSchema = noUnknown({ challengeId: z.string().uuid(), otp: z.string().regex(/^[0-9]{6}$/) });
const loginSchema = z.object({
  phone: z.preprocess((value) => {
    if (value === undefined || value === null) return undefined;
    const str = String(value).trim();
    return str.includes('@') ? str : str.replace(/\D/g, '');
  }, z.string().min(3).max(128)).optional(),
  email: z.string().trim().min(1).max(128).optional(),
  identifier: z.string().trim().min(1).max(128).optional(),
  password: z.string().min(1).max(128)
}).refine((data) => Boolean(data.phone || data.email || data.identifier), {
  message: 'Enter your mobile number, email, or farmer ID.'
});
const refreshSchema = noUnknown({ refreshToken: z.string().min(40).max(500) });
const logoutSchema = noUnknown({ refreshToken: z.string().min(40).max(500) });
const profileUpdateSchema = noUnknown({
  fullName: z.string().trim().min(2).max(120), village: z.string().trim().max(100).optional().default(''),
  district: z.string().trim().min(2).max(100), state: z.string().trim().min(2).max(100),
  preferredLanguage: z.enum(['en', 'hi']), preferredCentreId: z.coerce.number().int().positive().nullable().optional()
});
const officerProvisionSchema = noUnknown({
  fullName: z.string().trim().min(2).max(120), phone, temporaryPassword: password,
  centreIds: z.array(z.coerce.number().int().positive()).min(1).max(20)
});

module.exports = { registrationRequestSchema, otpVerificationSchema, loginSchema, refreshSchema, logoutSchema, profileUpdateSchema, officerProvisionSchema };
