"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        const data = res.data as { name?: string };
        setName(data.name || "");
        setSaved(!!data.name);
      } catch (error) {
        console.error("Fel vid hämtning av profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("/api/user/profile", { name });
      setSaved(true);
    } catch (error) {
      console.error("Fel vid sparande av namn:", error);
    }
  };

  if (loading) return <p>Laddar...</p>;

  return (
    <div className="space-y-4">
      {!saved ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skriv ditt namn"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Spara namn
          </button>
        </>
      ) : (
        <p className="text-green-600">Hej, {name}!</p>
      )}
    </div>
  );
}
