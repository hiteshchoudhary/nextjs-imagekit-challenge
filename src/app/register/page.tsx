import { RegisterForm } from "@/components/auth-components";

export default function RegisterPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">Create an Account</h1>
      <RegisterForm />
    </div>
  );
}
