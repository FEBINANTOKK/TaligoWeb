"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function HomePage() {
  const { data: session, isPending } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-2 text-foreground">
        Welcome to MyApp
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        A Next.js frontend powered by Better Auth
      </p>

      {isPending ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : session?.user ? (
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground no-underline font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground no-underline font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground border border-border no-underline font-semibold text-base hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
