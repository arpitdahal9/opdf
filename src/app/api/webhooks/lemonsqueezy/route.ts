import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(rawBody);
  const expected = hmac.digest("hex");

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { meta?: { event_name?: string }; data?: unknown };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload?.meta?.event_name;

  switch (eventName) {
    case "order_created":
      // One-time purchase (e.g. lifetime) completed
      break;
    case "subscription_created":
      // New subscription (e.g. monthly) started
      break;
    case "subscription_updated":
    case "subscription_cancelled":
    case "subscription_resumed":
    case "subscription_expired":
    case "subscription_paused":
    case "subscription_unpaused":
      // Subscription state changed
      break;
    default:
      // Other events: license_key_created, etc.
      break;
  }

  // TODO: persist order/subscription to your DB and grant access (e.g. link to Clerk user via custom_data)
  return NextResponse.json({ received: true });
}
