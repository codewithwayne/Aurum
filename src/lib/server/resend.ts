import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export async function sendOrderConfirmationEmail({
  toEmail,
  customerName,
  orderNumber,
  totalKes,
  items,
  pdfBuffer,
  mpesaReceipt,
}: {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  totalKes: number;
  items: any[];
  pdfBuffer?: Buffer;
  mpesaReceipt?: string;
}) {
  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">
          <strong>${item.name}</strong><br/>
          <span style="color: #666; font-size: 12px;">Size: ${item.size}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">KSh ${(item.priceKes * item.quantity).toLocaleString()}</td>
      </tr>
    `).join("");

    const attachments = pdfBuffer 
      ? [{ filename: `Receipt-${orderNumber}.pdf`, content: pdfBuffer }] 
      : undefined;

    await resend.emails.send({
      from: "Aurum Parfums <hello@aurumparfums.co.ke>",
      to: toEmail,
      subject: `Receipt for Order ${orderNumber}`,
      attachments,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f6ef; color: #1a3a2e; padding: 40px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <!-- EMAIL LOGO ADDED HERE -->
            <img src="https://aurumparfums.co.ke/logo.png" alt="Aurum Parfums" style="height: 60px; width: auto; margin-bottom: 10px;" />
            <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-top: 5px;">Smell like money</p>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e5e5;">
            <h2 style="font-family: Georgia, serif; font-size: 20px; margin-top: 0; border-bottom: 2px solid #1a3a2e; padding-bottom: 10px;">Payment Received</h2>
            
            <p style="font-size: 14px; line-height: 1.6;">Hi ${customerName},</p>
            <p style="font-size: 14px; line-height: 1.6;">Thank you for your order. We have successfully received your payment of <strong>KSh ${totalKes.toLocaleString()}</strong>.</p>

            ${mpesaReceipt ? `
            <div style="background-color: #e8f5e9; border: 1px solid #c8e6c9; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px; color: #2e7d32; text-transform: uppercase; letter-spacing: 1px;">M-Pesa Receipt</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-family: monospace; font-weight: bold; color: #1b5e20;">${mpesaReceipt}</p>
            </div>
            ` : ""}

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 1px solid #1a3a2e;">
                  <th style="text-align: left; padding-bottom: 10px;">Item</th>
                  <th style="text-align: center; padding-bottom: 10px;">Qty</th>
                  <th style="text-align: right; padding-bottom: 10px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold;">
              Total Paid: KSh ${totalKes.toLocaleString()}
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
            <p>We have attached a PDF copy of your receipt to this email.</p>
            <p>Our team will reach out shortly to arrange delivery.</p>
            <p style="margin-top: 20px;">© ${new Date().getFullYear()} Aurum Parfums</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send customer email:", error);
  }
}

export async function sendAdminOrderNotification({
  orderNumber,
  customerName,
  totalKes,
}: {
  orderNumber: string;
  customerName: string;
  totalKes: number;
}) {
  try {
    await resend.emails.send({
      from: "Aurum System <system@aurumparfums.co.ke>",
      to: "aurumparfumske@gmail.com", 
      subject: `🚨 New Order Received: ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Paid Order!</h2>
          <p><strong>Order:</strong> ${orderNumber}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Total:</strong> KSh ${totalKes.toLocaleString()}</p>
          <p><a href="https://aurumparfums.co.ke/admin/orders" style="display: inline-block; background: #1a3a2e; color: white; padding: 10px 20px; text-decoration: none; margin-top: 10px;">View in Admin</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin email:", error);
  }
}