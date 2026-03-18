import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Sign up | PleaseFixMyPDF",
  description: "Create a PleaseFixMyPDF account.",
  alternates: { canonical: "https://pleasefixmypdf.com/signup/" },
  robots: { index: false, follow: true },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Sign up", url: "/signup" },
];

export default function SignupPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn flex min-h-[60vh] items-center justify-center">
        <div className="card-surface w-full max-w-md p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign up</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create an account to save your preferences and get more free operations.
          </p>
          <form className="mt-6 space-y-4" action="#" method="post">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className="field-input mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="field-input mt-1"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="signup-confirm"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                minLength={8}
                className="field-input mt-1"
              />
            </div>
            <button type="submit" className="primary-button w-full">
              Create account
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
