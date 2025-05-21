"use client";

import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSession } from "next-auth/react";

const ProfileForm = () => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: async () => {
      const res = await axios.get<{ name: string }>("/api/user/profile");
      return { name: res.data.name };
    },
  });

  const onSubmit = async (data: { name: string }) => {
    try {
      await axios.put("/api/user/profile", data);
      alert("Profil uppdaterad!");
    } catch (error) {
      console.error("Fel vid uppdatering", error);
    }
  };

  if (!session) {
    return <p>Du måste vara inloggad för att se profilen.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      <p>E-post: {session.user?.email}</p>

      <div className="space-y-2">
        <label htmlFor="name">Namn</label>
        <input
          id="name"
          {...register("name", { required: "Namn krävs" })}
          type="text"
          className="input-class"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <button type="submit">Uppdatera Profil</button>
    </form>
  );
};

export default ProfileForm;
