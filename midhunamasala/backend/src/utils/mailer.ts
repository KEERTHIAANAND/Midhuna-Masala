import nodemailer from 'nodemailer';
import { env } from '../config/env';

// Reusable transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || 'smtp.gmail.com',
  port: env.SMTP_PORT || 465,
  secure: env.SMTP_PORT ? env.SMTP_PORT === 465 : true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

/**
 * Send an email using the configured transporter.
 * If credentials are not set, it logs to console instead.
 */
export async function sendEmail(options: nodemailer.SendMailOptions): Promise<void> {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('⚠️ SMTP not configured. Would have sent email:', options.subject, 'to', options.to);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Midhuna Masala" <${env.SMTP_USER}>`,
      ...options,
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw to avoid breaking the main flow (e.g. order placement shouldn't fail if email fails)
  }
}

/**
 * Send order confirmation to customer and admin
 */
export async function sendOrderConfirmation(
  userEmail: string,
  userName: string | null,
  order: any,
  items: any[]
): Promise<void> {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #E5D4B8; font-size: 15px;">
            <span style="font-weight: 600; color: #4A3728;">${item.name || item.product_name}</span>
            <span style="color: #888; font-size: 13px; margin-left: 5px;">x${item.quantity}</span>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #E5D4B8; text-align: right; font-weight: 600; color: #4A3728;">₹${Number(item.price || 0).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
  <div style="background-color: #F0EAE0; padding: 40px 20px; font-family: 'Georgia', serif; color: #4A3728;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background: linear-gradient(to right, #8B1E1E, #A02C2C); padding: 30px; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Midhuna Masala</h1>
        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; font-style: italic;">Traditional Stone Ground Spices</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #8B1E1E; margin-top: 0;">Thank you for your order!</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hi ${userName || 'Customer'},</p>
        <p style="font-size: 16px; line-height: 1.6;">Your order <strong style="color: #8B1E1E;">#${order.order_number || order.orderNumber}</strong> has been successfully placed and is being processed.</p>
        
        <!-- Order Summary -->
        <div style="margin: 30px 0; background-color: #FAF8F3; border-radius: 8px; padding: 20px; border: 1px solid #E5D4B8;">
          <h3 style="color: #8B1E1E; margin-top: 0; margin-bottom: 15px; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 15px 8px 0 8px; font-weight: bold; text-align: right; border-top: 2px solid #D4AF37; font-size: 18px;">Total</td>
                <td style="padding: 15px 8px 0 8px; font-weight: bold; text-align: right; border-top: 2px solid #D4AF37; font-size: 18px; color: #8B1E1E;">₹${Number(order.total || 0).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">We will notify you again as soon as your order is packed and shipped.</p>
        
        <div style="text-align: center; margin-top: 40px;">
          <a href="${env.CORS_ORIGIN || 'https://midhunamasala.com'}/track-order" style="background: linear-gradient(to right, #8B1E1E, #A02C2C); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-family: sans-serif; display: inline-block; letter-spacing: 1px;">TRACK YOUR ORDER</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #FAF8F3; padding: 20px; text-align: center; border-top: 1px solid #E5D4B8;">
        <p style="margin: 0; font-size: 14px; color: #8B1E1E;"><strong>Midhuna Masala</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">Kavindapadi, Tamil Nadu, India</p>
      </div>

    </div>
  </div>
  `;

  // Send to Customer
  if (userEmail) {
    await sendEmail({
      to: userEmail,
      subject: `Order Confirmation - #${order.order_number || order.orderNumber}`,
      html,
    });
  }

  // Send to Admin (Simplified style)
  if (env.CONTACT_EMAIL_TO) {
    const adminItemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${item.name || item.product_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');
    
    const adminHtml = `
      <div style="background-color: #f4f6f8; padding: 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333;">
        <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
          
          <div style="background-color: #f8fafc; padding: 20px; border-bottom: 1px solid #e2e8f0;">
            <div style="display: inline-block; background-color: #e0f2fe; color: #0284c7; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">System Alert</div>
            <h2 style="margin: 0; font-size: 20px; color: #0f172a;">New Order Received</h2>
          </div>

          <div style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; color: #64748b;">Order Number</td>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; text-align: right; color: #0f172a;">#${order.order_number || order.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; color: #64748b;">Customer</td>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; text-align: right; color: #0f172a;">${userName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; color: #64748b;">Email</td>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; text-align: right; color: #0284c7;">${userEmail || 'No Email'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; color: #64748b;">Total Amount</td>
                <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 16px; font-weight: bold; color: #16a34a; text-align: right;">₹${order.total}</td>
              </tr>
            </table>

            <h3 style="font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 10px; letter-spacing: 0.5px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 10px; text-align: left; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Item</th>
                  <th style="padding: 10px; text-align: center; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${adminItemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">This is an automated system notification.<br/>Log in to your Admin Dashboard to process this order.</p>
          </div>

        </div>
      </div>
    `;

    await sendEmail({
      to: env.CONTACT_EMAIL_TO,
      subject: `New Order Received - #${order.order_number || order.orderNumber}`,
      html: adminHtml,
    });
  }
}

/**
 * Send order status update to customer
 */
export async function sendOrderStatusUpdate(
  userEmail: string,
  userName: string | null,
  order: any,
  status: string
): Promise<void> {
  if (!userEmail) return;

  const orderNum = order.order_number || order.orderNumber;
  let message = '';
  
  if (status === 'packed') {
    message = 'Your order is currently being packed and getting ready for shipment.';
  } else if (status === 'shipped') {
    message = 'Great news! Your order has been shipped and is on its way to you.';
  } else if (status === 'delivered') {
    message = 'Your order has been delivered. We hope you enjoy the authentic flavors of Midhuna Masala!';
  } else {
    return; // Don't send emails for other statuses like pending, etc.
  }

  const html = `
  <div style="background-color: #F0EAE0; padding: 40px 20px; font-family: 'Georgia', serif; color: #4A3728;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background: linear-gradient(to right, #8B1E1E, #A02C2C); padding: 30px; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Midhuna Masala</h1>
        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; font-style: italic;">Order Update</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #8B1E1E; margin-top: 0;">Status: ${status.toUpperCase()}</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hi ${userName || 'Customer'},</p>
        
        <div style="background-color: #FAF8F3; border-left: 4px solid #D4AF37; padding: 15px 20px; margin: 25px 0;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4A3728;">${message}</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6;"><strong>Order Number:</strong> <span style="color: #8B1E1E;">#${orderNum}</span></p>
        
        <div style="text-align: center; margin-top: 40px;">
          <a href="${env.CORS_ORIGIN || 'https://midhunamasala.com'}/track-order" style="background: linear-gradient(to right, #8B1E1E, #A02C2C); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-family: sans-serif; display: inline-block; letter-spacing: 1px;">TRACK YOUR ORDER</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #FAF8F3; padding: 20px; text-align: center; border-top: 1px solid #E5D4B8;">
        <p style="margin: 0; font-size: 14px; color: #8B1E1E;"><strong>Midhuna Masala</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">Kavindapadi, Tamil Nadu, India</p>
      </div>

    </div>
  </div>
  `;

  await sendEmail({
    to: userEmail,
    subject: `Order Status Update - #${orderNum}`,
    html,
  });
}
