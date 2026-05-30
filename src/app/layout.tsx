import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth Next.js — Secure authentication",
  description:
    "Sign up, verify your email, sign in, and reset your password with a modern Next.js auth flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
