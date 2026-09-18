import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sign In",
  description:
    "Sign in to Ace the PMP to sync your progress, readiness score, and practice history across devices.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md py-12 text-center text-muted-foreground">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}