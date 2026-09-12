// Resend email notification when an order is marked ready.
// Requires RESEND_API_KEY and NOTIFY_EMAIL. Missing config is a no-op
// so local demos still work without a Resend account.

import { Resend } from "resend";
import type { Order } from "./types";

export async function notifyOrderReady(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "Campus Grounds <onboarding@resend.dev>",
      to: [to],
      subject: `Order #${order.id} is ready`,
      html: `
        <p>Hi ${escapeHtml(order.customerName)},</p>
        <p>Your <strong>${escapeHtml(order.item)}</strong> (order #${order.id}) is ready for pickup.</p>
        <p>— Campus Grounds</p>
      `,
    });
  } catch (err) {
    console.error("[notify] failed to send order-ready email:", err);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
