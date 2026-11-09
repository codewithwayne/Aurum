import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function generateReceiptPDF(order: any, mpesaReceipt?: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const green = rgb(0.1, 0.23, 0.18); // #1a3a2e
  const gray = rgb(0.4, 0.4, 0.4);
  
  let y = height - 60;

  // --- HEADER WITH LOGO ---
  try {
    // Read the logo from the public folder
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    
    // Scale the logo (adjust height as needed)
    const logoDims = logoImage.scale(0.15); 
    page.drawImage(logoImage, {
      x: 50,
      y: y - 20,
      width: logoDims.width,
      height: logoDims.height,
    });
  } catch (error) {
    // Fallback to text if the logo fails to load
    console.error("Could not load logo for PDF", error);
    page.drawText("Aurum Parfums", { x: 50, y, size: 24, font: boldFont, color: green });
  }

  // Receipt Details (Top Right)
  page.drawText(`Order: ${order.orderNumber}`, { x: width - 200, y, size: 12, font: boldFont });
  page.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { x: width - 200, y: y - 20, size: 10, font, color: gray });
  
  y -= 70;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: green });
  
  // Customer Details
  y -= 30;
  page.drawText("Billed To:", { x: 50, y, size: 10, font: boldFont });
  page.drawText(order.customerName, { x: 50, y: y - 15, size: 10, font });
  page.drawText(order.customerPhone, { x: 50, y: y - 30, size: 10, font });
  
  // Items Header
  y -= 60;
  page.drawText("Item", { x: 50, y, size: 10, font: boldFont });
  page.drawText("Qty", { x: 350, y, size: 10, font: boldFont });
  page.drawText("Price", { x: 450, y, size: 10, font: boldFont });
  
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: gray });
  
  // Items List
  y -= 25;
  for (const item of order.items) {
    page.drawText(`${item.name} (${item.size})`, { x: 50, y, size: 10, font });
    page.drawText(item.quantity.toString(), { x: 350, y, size: 10, font });
    page.drawText(`KSh ${(item.priceKes * item.quantity).toLocaleString()}`, { x: 450, y, size: 10, font });
    y -= 20;
  }
  
  // Totals
  y -= 10;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: gray });
  y -= 25;
  page.drawText("Subtotal", { x: 350, y, size: 10, font });
  page.drawText(`KSh ${order.subtotalKes.toLocaleString()}`, { x: 450, y, size: 10, font });
  
  y -= 20;
  page.drawText("Delivery", { x: 350, y, size: 10, font });
  page.drawText(`KSh ${order.deliveryFeeKes.toLocaleString()}`, { x: 450, y, size: 10, font });
  
  y -= 25;
  page.drawText("Total Paid", { x: 350, y, size: 12, font: boldFont, color: green });
  page.drawText(`KSh ${order.totalKes.toLocaleString()}`, { x: 450, y, size: 12, font: boldFont, color: green });

  // Payment Info
  if (mpesaReceipt) {
    y -= 40;
    page.drawText("M-Pesa Receipt Number:", { x: 50, y, size: 10, font: boldFont });
    page.drawText(mpesaReceipt, { x: 50, y: y - 15, size: 12, font, color: green });
  }

  // Footer
  page.drawText("Thank you for shopping with Aurum Parfums.", { x: 50, y: 50, size: 10, font, color: gray });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}