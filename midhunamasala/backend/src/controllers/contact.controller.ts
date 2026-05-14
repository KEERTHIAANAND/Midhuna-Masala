import type { Request, Response } from 'express';
import { env } from '../config/env';
import { sendEmail } from '../utils/mailer';

export async function submitContactForm(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
      return;
    }

    const mailOptions = {
      from: `"${name}" <${env.SMTP_USER}>`, // Sender address (needs to be authorized by the SMTP provider)
      replyTo: email, // Reply to the person who filled out the form
      to: env.CONTACT_EMAIL_TO, // 'midhunamasala1977@gmail.com'
      subject: `Midhuna Masala Contact: ${subject || 'New Message from Website'}`,
      text: `
You have received a new message from the Midhuna Masala contact form.

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject || 'None'}

Message:
${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'None'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await sendEmail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
}
