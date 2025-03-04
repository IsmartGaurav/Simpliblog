import { Resend } from 'resend';
import { ReactElement } from 'react';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string[];
  subject: string;
  react: ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailProps) {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      react,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}