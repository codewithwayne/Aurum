import "server-only";
import { Resend } from "resend";

// We initialize with an empty string fallback so it doesn't crash during local build if the key is missing
const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export async function sendOrderConfirmationEmail({
  toEmail,
  customerName,
  orderNumber,
  totalKes,
  items,
}: {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  totalKes: number;
  items: any[];
}) {
  try {
    await resend.emails.send({
      from: "Aurum Parfums <hello@aurumparfums.co.ke>", // Must match your verified domain
      to: toEmail,
      subject: `Order Confirmed — ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a3a2e;">
          <h1 style="font-size: 24px; font-family: Georgia, serif;">Thank you, ${customerName}.</h1>
          <p>Your payment for order <strong>${orderNumber}</strong> has been received.</p>
          <div style="background-color: #f0eadc; padding: 20px; margin: 20px 0;">
            <h2 style="font-size: 16px; margin-top: 0;">Order Summary</h2>
            ${items.map(item => `<p style="margin: 4px 0;">${item.quantity} × ${item.name} (${item.size}) — KSh ${(item.priceKes * item.quantity).toLocaleString()}</p>`).join("")}
            <p style="margin-top: 16px; font-weight: bold;">Total Paid: KSh ${totalKes.toLocaleString()}</p>
          </div>
          <p>Our team will reach out to you shortly on the phone number provided to arrange delivery.</p>
          <p>Smell like money.</p>
          <p style="font-size: 12px; color: #666; margin-top: 40px;">Aurum Parfums</p>
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
      to: "aurumparfumske@gmail.com", // REPLACE THIS WITH YOUR REAL EMAIL
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