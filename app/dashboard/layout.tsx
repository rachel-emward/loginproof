import { SessionTimeout } from "./SessionTimeout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionTimeout>{children}</SessionTimeout>;
}
