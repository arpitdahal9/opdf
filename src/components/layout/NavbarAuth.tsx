"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

const userButtonAppearance = {
  elements: {
    avatarBox: "h-9 w-9",
  },
} as const;

export function NavbarAuthDesktop() {
  return (
    <>
      <SignedOut>
        <div className="hidden lg:flex items-center gap-1">
          <SignInButton mode="modal">
            <button
              type="button"
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-white bg-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Sign up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="hidden lg:block">
          <UserButton afterSignOutUrl="/" appearance={userButtonAppearance} />
        </div>
      </SignedIn>
    </>
  );
}

export function NavbarAuthMobile({ onClose }: { onClose: () => void }) {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Log in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Sign up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <UserButton afterSignOutUrl="/" appearance={userButtonAppearance} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Account
          </span>
        </div>
      </SignedIn>
    </>
  );
}
