"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PROFILE_COVER_IMAGE } from "@/lib/profile";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-4">
        <svg
          className="h-5 w-5 animate-spin text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    </div>
  );
}

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const passwordsFilled =
      password.length > 0 && confirmPassword.length > 0;
    const mismatch = confirmPassword !== password;

    setPasswordMismatch(mismatch && confirmPassword.length > 0);
    setButtonDisabled(!passwordsFilled || mismatch);
  }, [password, confirmPassword]);

  const resetPassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset link");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (buttonDisabled || loading) return;

    try {
      setLoading(true);
      await axios.post("/api/users/resetPassword", {
        token,
        password: password.trim(),
      });
      setSuccess(true);
      toast.success("Password reset successfully");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : "Failed to reset password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30 md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden min-h-[520px] md:block">
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
                  Choose a new password.
                </h1>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Use the link from your email to set a new password. Links
                  expire after one hour for your security.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-zinc-200">
                  Strong password tips
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Use at least 8 characters with a mix of letters and numbers.
                  Don&apos;t reuse passwords from other sites.
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

              {!token ? (
                <div className="text-center sm:text-left">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 sm:mx-0">
                    <svg
                      className="h-7 w-7 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-emerald-400">
                    Invalid link
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">
                    Missing reset token
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Open the password reset link from your email. If it expired,
                    request a new one below.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/forgotPassword"
                      className="inline-flex flex-1 items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                    >
                      Request new link
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              ) : success ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-emerald-400">
                    All set
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">
                    Password updated
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Your password has been reset. Redirecting you to sign in...
                  </p>
                  <Link
                    href="/login"
                    className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 sm:w-auto"
                  >
                    Sign in now
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <p className="text-sm font-medium text-emerald-400">
                      Account recovery
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                      Reset password
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      Enter and confirm your new password below.
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={resetPassword}>
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-zinc-300"
                        htmlFor="password"
                      >
                        New password
                      </label>
                      <input
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        placeholder="Enter a strong password"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-zinc-300"
                        htmlFor="confirmPassword"
                      >
                        Confirm password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                      {passwordMismatch && (
                        <p className="mt-2 text-sm text-red-400">
                          Passwords do not match
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={buttonDisabled || loading}
                      className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      {loading
                        ? "Updating password..."
                        : buttonDisabled
                          ? "Fill and match passwords"
                          : "Reset password"}
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
