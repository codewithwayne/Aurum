import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  toEmail,
  customerName,
  orderNumber,
  totalKes,
}: {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  totalKes: number;
}) {
  try {
    const data = await resend.emails.send({
      from: "Aurum Parfums <onboarding@resend.dev>", // Change this after verifying your domain
      to: toEmail,
      subject: `Order Confirmed - ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a3a2e;">
          <h1 style="font-size: 24px;">Thank you, ${customerName}.</h1>
          <p>Your payment for order <strong>${orderNumber}</strong> has been received.</p>
          <p><strong>Total Paid:</strong> KSh ${totalKes.toLocaleString()}</p>
          <br/>
          <p>Our team will reach out to you shortly on the phone number provided to arrange delivery.</p>
          <p>Smell like money.</p>
          <p style="font-size: 12px; color: #666;">Aurum Parfums</p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    return null;
  }
}