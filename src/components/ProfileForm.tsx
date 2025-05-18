"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface ProfileFormProps {
  email: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ email }) => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<{ name: string }>({ name: "" });

  useEffect(() => {
    if (session) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get<{ name: string }>("/api/user/profile");
          setUserData(res.data);
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      };

      fetchProfile();
    }
  }, [session]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const onSubmit = async (data: { name: string }) => {
    try {
      await axios.put("/api/user/profile", data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (!session) return <div>You must be logged in to view this page.</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      <p>Email: {email}</p>
      <div className="space-y-2">
        <label htmlFor="name">Namn</label>
        <input
          id="name"
          {...register("name", { required: "Name is required" })}
          defaultValue={userData.name}
          type="text"
          className="input-class"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <button type="submit">Uppdatera Profil</button>
    </form>
  );
};

export default ProfileForm;
