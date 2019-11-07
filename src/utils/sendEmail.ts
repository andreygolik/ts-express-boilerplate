import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, FROM_EMAIL, FROM_NAME } from '../config/config';
import logger from '../config/logger';

export interface IEmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: IEmailOptions) => {
  const transportOptions: SMTPTransport.Options = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(transportOptions);

  const message = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter
    .sendMail(message)
    .then((info) => logger.info(`Email sent: ${info.messageId}`))
    .catch((err) => {
      logger.error(`Unable to send email: ${err}`);
      throw err;
    });
};
