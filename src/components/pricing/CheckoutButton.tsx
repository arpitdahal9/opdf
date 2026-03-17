"use client";

import { useState } from "react";

type Plan = "monthly" | "lifetime";

export function CheckoutButton({
  plan,
  children,
  className,
}: {
  plan: Plan;
  children: React.ReactNode;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      if (!res.ok) {
        console.error("Checkout error:", data?.error ?? res.statusText);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? "Redirecting…" : children}
    </button>
  );
}
