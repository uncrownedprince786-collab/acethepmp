import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create Account",
  description:
    "Create a free Ace the PMP account to save your progress, readiness score, and practice history.",
  path: "/register",
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
