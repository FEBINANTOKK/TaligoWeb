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
  | "MyResume"
  | "Application"
  | "Applications"
  | "Organization"
  | "Organizations"
  | "Users"
  | "OrgJob"
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
      can("READ", "MyApplication");
      can("READ", "MyResume");

      ////
      can("READ", "Profile");
      can("UPDATE", "Profile");
      can("READ", "Job");
      can("CREATE", "Application");
      can("DELETE", "MyApplication");
      break;

    case "RECRUITER":
      can("READ", "Employee");
      can("READ", "Applications");
      can("MANAGE", "OrgJob");
      can("READ", "ResumeBank");
      can("READ", "Employee");

      /////////////

      can("CREATE", "OrgJob");
      can("READ", "Job");
      can("UPDATE", "OrgJob");
      can("UPDATE", "Applications");
      break;

    case "ORGADMIN":
      can("READ", "Applications");
      can("MANAGE", "OrgJob");
      can("MANAGE", "Organization");
      can("READ", "ResumeBank");
      can("READ", "Employee");

      //////////////
      // can("MANAGE", "Users");
      can("MANAGE", "Employee");
      can("MANAGE", "Approval");
      can("UPDATE", "Applications");

      break;

    case "SUPERADMIN":
      can("MANAGE", "Organizations");
      can("MANAGE", "Job"); //All jobs in platform
      ///////
      can("MANAGE", "Users");
      can("MANAGE", "Employee");
      can("MANAGE", "Approval");

      can("MANAGE", "Applications");
      can("MANAGE", "AppSettings");
      // can("READ", "ResumeBank");
      can("MANAGE", "Resume");

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
