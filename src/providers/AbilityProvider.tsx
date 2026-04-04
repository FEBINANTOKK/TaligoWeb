"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { createContextualCan } from "@casl/react";
import { PureAbility, AbilityBuilder } from "@casl/ability";
import { useSession } from "@/lib/auth-client";
import { getUserRole } from "@/lib/user-role";
export type Actions = "READ" | "MANAGE" | "CREATE" | "UPDATE" | "DELETE";

export type Subjects =
  | "Profile"
  | "Job"
  | "Application"
  | "Organization"
  | "Employee"
  | "Approval"
  | "AppSettings"
  | "All";
export type AppAbility = PureAbility<[Actions, Subjects]>;

export const AbilityContext = createContext<AppAbility>({} as AppAbility);
export const Can = createContextualCan(AbilityContext.Consumer);

// Define ability factory with role
function defineAbilityFor(role: string | undefined): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<
    PureAbility<[Actions, Subjects]>
  >(PureAbility as any);

  // Basic permissions for all authenticated users
  can("READ", "Profile");

  switch (role?.toUpperCase()) {
    case "CANDIDATE":
      can("READ", "Profile");
      can("UPDATE", "Profile");
      can("READ", "Job");
      can("CREATE", "Application");
      can("READ", "Application");
      can("DELETE", "Application");
      break;

    case "RECRUITER":
      can("CREATE", "Job");
      can("READ", "Job");
      can("UPDATE", "Job");
      can("READ", "Application");
      can("UPDATE", "Application");
      can("READ", "Employee");
      break;

    case "ORGADMIN":
      can("MANAGE", "Employee");
      can("MANAGE", "Approval");
      can("MANAGE", "Job");
      can("MANAGE", "Application");
      can("MANAGE", "AppSettings");
      can("UPDATE", "Organization");
      break;

    case "SUPERADMIN":
      can("MANAGE", "All");
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
