// src/components/RegisterForm.tsx
"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Ogiltig e-postadress" }),
    password: z.string().min(6, { message: "Minst 6 tecken krävs" }),
    confirmPassword: z.string().min(6, { message: "Bekräfta lösenordet" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setErrorMsg("");

    // Steg 1: Skicka till backend
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setErrorMsg(result.message || "Ett fel uppstod vid registrering");
      return;
    }

    // Steg 2: Logga in automatiskt
    const signInResult = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (signInResult?.error) {
      setErrorMsg("Kunde inte logga in automatiskt");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="space-y-2">
        <Label htmlFor="email">E-post</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Lösenord</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Button type="submit" className="w-full">
        Registrera
      </Button>
    </form>
  );
}
