import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-5xl">{children}</div>;
}
