'use server'; // Directive indicating this is server-side

import nodemailer from 'nodemailer';
import { contactformSchema } from '@/lib/form-type';
import z from 'zod';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: 'usnumerber@gmail.com',
    pass: 'gkfqtriudyvxrcir',
  },
});

// Function to send email to admin
const sendMailtoAdmin = async (values: z.infer<typeof contactformSchema>) => {
  const mailOptions = {
    from: 'usnumerber@gmail.com',
    to: 'talhariaz5425869@gmail.com',
    subject: `From ${values.name}`,
    text: `sender: ${values.email}\nMessage: ${values.message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { err: false, info };
  } catch (error) {
    console.error('Error sending mail to admin:', error);
    return { err: true, error };
  }
};

// Function to send confirmation email to the user
export const sendContactMail = async (values: z.infer<typeof contactformSchema>) => {
  try {
    const output = await sendMailtoAdmin(values);

    if (output.err) return { err: true, error: output.error, info: null };

    // Sending confirmation email to user
    const mailOptions = {
      from: 'usnumerber@gmail.com',
      to: values.email,
      subject: 'From Talha',
      text: 'Thanks for contacting me. I will respond as soon as possible.',
    };

    const info = await transporter.sendMail(mailOptions);
    return { err: false, info, error: null };

  } catch (err: any) {
    console.error('Error sending confirmation mail:', err);
    return { err: true, error: err, info: null };
  }
};
