"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelection from "@/components/onboarding/RoleSelection";
import OrganizationChoice from "@/components/onboarding/OrganizationChoice";
import CreateOrgForm from "@/components/onboarding/CreateOrgForm";
import JoinOrgForm from "@/components/onboarding/JoinOrgForm";
import { postProtected } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { getDashboardPathForRole, getUserRole } from "@/lib/user-role";

type Step = "role" | "org-choice" | "create-org" | "join-org";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [step, setStep] = useState<Step>("role");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    let cancelled = false;

    const routeIfRoleExists = async () => {
      const role = await getUserRole();
      if (cancelled) {
        return;
      }

      if (role) {
        router.push(getDashboardPathForRole(role));
      }
    };

    void routeIfRoleExists();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, router]);

  const handleFindJobs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await postProtected("/api/user/select-role", { role: "candidate" });
      router.replace("/dashboard/candidate");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to select candidate role.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHireTalent = () => {
    setError(null);
    setStep("org-choice");
  };

  const handleCreateOrganization = async (organizationName: string) => {
    if (!organizationName) {
      setError("Organization name is required. front");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await postProtected("/api/organization/create", {
        name: organizationName,
      });
      //   await postProtected("/api/user/select-role", { role: "recruiter" });

      router.replace("/dashboard/recruiter");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create organization.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinOrganization = async (joinCode: string) => {
    if (!joinCode) {
      setError("Join code is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      //   await postProtected("/api/user/select-role", { role: "recruiter" });
      await postProtected("/api/organization/join", { joinCode });
      router.replace("/dashboard/recruiter");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to join organization.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-8">
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_top,rgba(194,140,69,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(68,121,161,0.12),transparent_45%)]" />

      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        {error && (
          <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {step === "role" && (
          <RoleSelection
            onFindJobs={handleFindJobs}
            onHireTalent={handleHireTalent}
            isLoading={isLoading}
          />
        )}

        {step === "org-choice" && (
          <OrganizationChoice
            onCreate={() => {
              setError(null);
              setStep("create-org");
            }}
            onJoin={() => {
              setError(null);
              setStep("join-org");
            }}
            onBack={() => {
              setError(null);
              setStep("role");
            }}
            isLoading={isLoading}
          />
        )}

        {step === "create-org" && (
          <CreateOrgForm
            onSubmit={handleCreateOrganization}
            onBack={() => {
              setError(null);
              setStep("org-choice");
            }}
            isLoading={isLoading}
          />
        )}

        {step === "join-org" && (
          <JoinOrgForm
            onSubmit={handleJoinOrganization}
            onBack={() => {
              setError(null);
              setStep("org-choice");
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
