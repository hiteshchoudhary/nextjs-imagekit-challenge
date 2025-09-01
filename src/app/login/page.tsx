import { Suspense } from "react";

import { LoginForm } from "@/components/auth-components";

export default function LoginPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
