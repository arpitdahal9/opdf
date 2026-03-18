import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Log in | PleaseFixMyPDF",
  description: "Log in to your PleaseFixMyPDF account.",
  alternates: { canonical: "https://pleasefixmypdf.com/login/" },
  robots: { index: false, follow: true },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Log in", url: "/login" },
];

export default function LoginPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn flex min-h-[60vh] items-center justify-center">
        <div className="card-surface w-full max-w-md p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Log in</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to your account to access your tools and settings.
          </p>
          <form className="mt-6 space-y-4" action="#" method="post">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className="field-input mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="field-input mt-1"
              />
            </div>
            <button type="submit" className="primary-button w-full">
              Log in
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
