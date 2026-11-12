import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-[#E4DCCB]">{children}</div>;
}
