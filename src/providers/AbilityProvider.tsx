"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { createContextualCan } from "@casl/react";
import { PureAbility, AbilityBuilder } from "@casl/ability";
import { useSession } from "@/lib/auth-client";
import { getUserRole } from "@/lib/user-role";

export type Actions = "READ" | "MANAGE" | "CREATE" | "UPDATE" | "DELETE";

export type Subjects =
  | "Profile"
  | "Resume"
  | "ResumeBank"
  | "Job"
  | "Applications"
  | "Organization"
  | "Organizations"
  | "Users"
  | "Employee"
  | "Approval"
  | "Settings"
  | "AppSettings"
  | "MyApplication"
  | "All";
export type AppAbility = PureAbility<[Actions, Subjects]>;

export const AbilityContext = createContext<AppAbility>({} as AppAbility);
export const Can = createContextualCan(AbilityContext.Consumer);

// Define ability factory with role
function defineAbilityFor(role: string | undefined): AppAbility {
  const { can, build } = new AbilityBuilder<PureAbility<[Actions, Subjects]>>(
    PureAbility as any,
  );
  console.log(role);

  // Basic permissions for all authenticated users
  can("READ", "Profile");
  can("READ", "Settings");

  switch (role?.toUpperCase()) {
    case "CANDIDATE":
      can("READ", "Profile");
      can("UPDATE", "Profile");
      can("READ", "Resume");
      can("READ", "Job");
      can("CREATE", "Applications");
      can("READ", "MyApplication");
      can("DELETE", "Applications");
      break;

    case "RECRUITER":
      can("CREATE", "Job");
      can("READ", "Job");
      can("UPDATE", "Job");
      can("READ", "Applications");
      can("UPDATE", "Applications");
      can("READ", "ResumeBank");
      can("READ", "Employee");
      can("MANAGE", "Job");
      break;

    case "ORGADMIN":
      can("MANAGE", "Users");
      can("MANAGE", "Employee");
      can("MANAGE", "Approval");
      can("MANAGE", "Job");
      //   can("READ", "Applications");
      //   can("MANAGE", "Applications");
      can("MANAGE", "AppSettings");
      can("MANAGE", "Organization");
      can("READ", "ResumeBank");
      break;

    case "SUPERADMIN":
      can("MANAGE", "Users");
      can("MANAGE", "Employee");
      can("MANAGE", "Approval");
      can("MANAGE", "Job");
      can("MANAGE", "Applications");
      can("MANAGE", "Organization");
      can("MANAGE", "AppSettings");
      can("READ", "ResumeBank");
      can("READ", "Resume");
      break;

    default:
      // unauthenticated / unknown role
      break;
  }

  return build();
}

export function AbilityProvider({ children }: { children: ReactNode }) {
  const [ability, setAbility] = useState<AppAbility>(
    defineAbilityFor(undefined),
  );
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const initializeAbilities = async () => {
      if (isPending) {
        return;
      }

      try {
        if (!session?.user) {
          setAbility(defineAbilityFor(undefined));
          return;
        }

        const role = await getUserRole();

        if (!role) {
          setAbility(defineAbilityFor("CANDIDATE"));
          return;
        }

        const updatedAbility = defineAbilityFor(role);
        setAbility(updatedAbility);
      } catch (error) {
        console.error("Error initializing abilities:", error);
        setAbility(defineAbilityFor(undefined));
      }
    };

    void initializeAbilities();
  }, [session, isPending]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
