import LoginForm from "@/components/Login/LoginFrom";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm/>
    </Suspense>
  );
}