"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProtected } from "@/lib/api";

interface ProtectedData {
  message: string;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [apiData, setApiData] = useState<ProtectedData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  const callProtectedApi = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiData(null);

    try {
      const data = await fetchProtected<ProtectedData>("/api/protected");
      setApiData(data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "API call failed");
    } finally {
      setApiLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>

      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] text-[var(--card-foreground)] shadow-sm">
        <h2 className="text-lg font-semibold mb-3">User Info</h2>
        <p>
          <strong>Name:</strong> {session.user.name}
        </p>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
      </div>

      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] text-[var(--card-foreground)] shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Protected API Call</h2>
        <button
          onClick={callProtectedApi}
          disabled={apiLoading}
          className="px-4 py-2 border-none rounded-md bg-primary text-primary-foreground text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {apiLoading ? "Calling..." : "Call GET /api/protected"}
        </button>

        {apiData && (
          <pre className="mt-4 p-4 bg-muted rounded-md overflow-auto text-sm text-foreground">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        )}
        {apiError && (
          <p className="mt-3 text-destructive text-sm">{apiError}</p>
        )}
      </div>
    </div>
  );
}
