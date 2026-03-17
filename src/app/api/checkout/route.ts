import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { NextRequest, NextResponse } from "next/server";

const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
const variantMonthly = process.env.LEMON_SQUEEZY_VARIANT_ID_MONTHLY;
const variantLifetime = process.env.LEMON_SQUEEZY_VARIANT_ID_LIFETIME;
const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

export async function POST(request: NextRequest) {
  if (!apiKey || !storeId || !variantMonthly || !variantLifetime) {
    return NextResponse.json(
      { error: "Lemon Squeezy is not configured" },
      { status: 503 }
    );
  }

  lemonSqueezySetup({ apiKey });

  const body = await request.json().catch(() => ({}));
  const plan = body?.plan === "lifetime" ? "lifetime" : "monthly";
  const variantId = plan === "lifetime" ? variantLifetime : variantMonthly;

  const origin = request.headers.get("origin") || request.nextUrl.origin;
  const successUrl = `${origin}/pricing?success=1`;

  const { error, data } = await createCheckout(storeId, variantId, {
    productOptions: {
      redirectUrl: successUrl,
    },
  });

  if (error || !data?.data?.attributes?.url) {
    console.error("[Lemon Squeezy] createCheckout failed:", error ?? data);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    url: (data.data as { attributes: { url: string } }).attributes.url,
  });
}
