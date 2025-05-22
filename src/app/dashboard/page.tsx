// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Se till att denna exporteras
import ProfileForm from "@/components/ProfileForm";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Du måste vara inloggad för att se denna sida.</div>;
  }

  return (
    <div>
      <h1>Välkommen till din dashboard, {session.user?.name || "User"}!</h1>
      <ProfileForm />
    </div>
  );
}
