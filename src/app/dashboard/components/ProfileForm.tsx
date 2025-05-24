"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type FormData = {
  name: string;
};

type ProfileResponse = {
  name: string;
};

export default function ProfileForm() {
  const [isSaved, setIsSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useSession(); // valfri i detta fall

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get<ProfileResponse>("/api/user/profile");
        setValue("name", res.data.name);
      } catch (error) {
        console.error("Kunde inte hämta profil", error);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put("/api/user/profile", data);
      setIsSaved(true);
    } catch (error) {
      console.error("Fel vid uppdatering", error);
      alert("Det gick inte att uppdatera profilen.");
    }
  };

  if (isSaved) {
    return (
      <div className="text-center mt-6">
        <p className="text-green-600 text-lg font-medium">
          Namnet har sparats! ✅
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto mt-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Namn</Label>
        <Input
          id="name"
          {...register("name", { required: "Namn krävs" })}
          placeholder="Ditt namn"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sparar..." : "Spara"}
      </Button>
    </form>
  );
}
