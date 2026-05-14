import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { env } from '../config/env';

export async function submitContactForm(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
      return;
    }

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'smtp.gmail.com', // Default to gmail for simplicity
      port: env.SMTP_PORT || 465, // Use 465 for SSL instead of 587
      secure: env.SMTP_PORT ? env.SMTP_PORT === 465 : true, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
    });

    // If SMTP_USER is not configured, we'll just log it for now to avoid breaking the frontend when testing locally
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials are not configured. The contact form would have sent:');
      console.warn({ name, email, phone, subject, message });
      
      // Simulate successful sending for development
      res.status(200).json({ 
        success: true, 
        message: 'Message received (Development mode - no email sent because SMTP is not configured).' 
      });
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent: %s', info.messageId);

    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
}
