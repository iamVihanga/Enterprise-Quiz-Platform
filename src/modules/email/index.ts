"use server";

import { resend } from "./resend.config";

interface SendMailParams {
  to: string;
  subject: string;
  text: string;
}

const FROM_ADDRESS = "Acme <onboarding@resend.dev>";

export async function sendMail({ subject, text, to }: SendMailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      subject: subject,
      text: text,
    });

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    return { error: (error as Error)?.message || "Failed to send email !" };
  }
}
