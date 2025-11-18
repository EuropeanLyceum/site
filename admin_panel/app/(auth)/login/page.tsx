'use client';

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic"; // ⬅️ це ключове!

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Завантаження...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
