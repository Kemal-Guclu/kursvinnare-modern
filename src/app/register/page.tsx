// src/app/register.tsx
import RegisterForm from "@/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Registrera dig</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
