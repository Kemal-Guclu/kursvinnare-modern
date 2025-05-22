"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }),
  password: z.string().min(6, { message: "Minst 6 tecken krävs" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoginError(null); // Rensa tidigare fel
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setLoginError("Fel e-postadress eller lösenord.");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      {loginError && (
        <p className="text-sm text-red-600 font-semibold">{loginError}</p>
      )}

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

      <Button type="submit" className="w-full">
        Logga in
      </Button>
    </form>
  );
}
