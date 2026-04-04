"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session?.user) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/sign-in");
  }, [isPending, session, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_top,rgba(194,140,69,0.14),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(90,125,160,0.1),transparent_45%)]" />

      <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-border bg-card/85 p-8 text-center shadow-lg backdrop-blur-sm">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <h1 className="text-xl font-semibold text-card-foreground">
          Checking your session
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You will be redirected automatically.
        </p>
      </div>
    </div>
  );
}
