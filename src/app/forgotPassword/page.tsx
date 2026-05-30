"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { PROFILE_COVER_IMAGE } from "@/lib/profile";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const forgotPassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || loading) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotPassword", {
        email: email.trim(),
      });
      console.log("Forgot password success", response.data);
      setSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : "Failed to send reset link";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30 md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden min-h-[480px] md:block">
            <Image
              src={PROFILE_COVER_IMAGE}
              alt="Abstract background"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
            <div className="relative flex h-full flex-col justify-between p-8">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Auth Next.js
                </p>
                <h1 className="mt-5 text-4xl font-semibold leading-tight text-white">
                  Reset your password.
                </h1>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  We&apos;ll email you a secure link to choose a new password.
                  The link expires after one hour.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-zinc-200">
                  Check your inbox
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Use the same email or username you signed up with. Check spam
                  if you don&apos;t see the message.
                </p>
              </div>
            </div>
          </section>

          <main className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 md:hidden">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Auth Next.js
                </p>
              </div>

              {sent ? (
                <div className="text-center sm:text-left">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 sm:mx-0">
                    <svg
                      className="h-7 w-7 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-emerald-400">
                    Email sent
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">
                    Check your inbox
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    If an account exists for{" "}
                    <span className="font-medium text-zinc-200">{email}</span>,
                    you&apos;ll receive a password reset link shortly. Open the
                    link from your email to set a new password.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/login"
                      className="inline-flex flex-1 items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                    >
                      Back to login
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                    >
                      Send again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <p className="text-sm font-medium text-emerald-400">
                      Account recovery
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                      Forgot password?
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      Enter your email or username and we&apos;ll send you a
                      reset link.
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={forgotPassword}>
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-zinc-300"
                        htmlFor="email"
                      >
                        Email or username
                      </label>
                      <input
                        id="email"
                        type="text"
                        autoComplete="username"
                        placeholder="you@example.com"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!email.trim() || loading}
                      className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      {loading ? "Sending link..." : "Send reset link"}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-zinc-400">
                    Remember your password?{" "}
                    <Link
                      className="font-medium text-emerald-400 hover:text-emerald-300"
                      href="/login"
                    >
                      Sign in
                    </Link>
                  </p>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
