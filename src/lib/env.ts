import { z } from "zod";

const envSchema = z.object({
  SITE_URL: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),

  BETTER_AUTH_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  EMAIL_VERIFICATION_CALLBACK_URL: z.string(),

  DATABASE_URL: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  APPLE_CLIENT_ID: z.string().min(1),
  APPLE_CLIENT_SECRET: z.string().min(1),

  UPLOADTHING_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;

export type Environment = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
