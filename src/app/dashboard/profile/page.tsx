import ProfileForm from "../components/ProfileForm";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto mt-8 px-4">
      <Link
        href="/dashboard"
        className="text-blue-600 hover:underline block mb-4"
      >
        ← Tillbaka
      </Link>
      <h2 className="text-xl font-bold mb-4">Uppdatera profil</h2>
      <ProfileForm />
    </div>
  );
}
