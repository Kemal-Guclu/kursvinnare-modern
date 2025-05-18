"use client";

import React from "react";
import { useSession } from "next-auth/react"; // Om du använder next-auth för sessioner
import ProfileForm from "@/components/ProfileForm"; // Se till att importen är korrekt

const DashboardPage = () => {
  const { data: session, status } = useSession();

  // Hantera laddningstillståndet för session
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Om sessionen inte finns, visa ett meddelande
  if (!session) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div>
      <h1>Welcome to your dashboard, {session.user?.name || "User"}!</h1>
      <ProfileForm email={session.user?.email || ""} />
    </div>
  );
};

export default DashboardPage;
