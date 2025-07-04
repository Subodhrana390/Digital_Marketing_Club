import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Digital Marketing Club",
  description: "Login to the admin dashboard.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        {children}
    </>
  );
}
