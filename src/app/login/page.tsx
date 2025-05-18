// src/app/login/login.tsx
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Logga in</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
