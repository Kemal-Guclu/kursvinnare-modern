import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardPageClient from "./DashboardPageClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Du måste vara inloggad för att se denna sida.</div>;
  }

  return <DashboardPageClient name={session.user?.name ?? "Användare"} />;
}
