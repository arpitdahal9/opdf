"use client";

import { ClerkProvider } from "@clerk/clerk-react";

const appearance = {
  layout: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
} as const;

const localization = {
  signIn: {
    start: {
      title: "Sign in to PleaseFixMyPDF",
    },
  },
} as const;

export function ClerkProviderClient({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return <>{children}</>;
  }
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={appearance}
      localization={localization}
    >
      {children}
    </ClerkProvider>
  );
}
