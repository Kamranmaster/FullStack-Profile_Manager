"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { PROFILE_COVER_IMAGE } from "@/lib/profile";

type VerifyStatus = "idle" | "loading" | "success" | "error" | "missing";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailFallback() {
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
        <p className="text-sm text-zinc-400">Loading verification...</p>
      </div>
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const verifyEmail = useCallback(async (verifyToken: string) => {
    try {
      setStatus("loading");
      setErrorMessage("");
      await axios.post("/api/users/verifyemail", { token: verifyToken });
      setStatus("success");
      toast.success("Email verified successfully!");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : "Verification failed. The link may be invalid or expired.";
      setErrorMessage(message);
      setStatus("error");
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return;
    }
    verifyEmail(token);
  }, [token, verifyEmail]);

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
                  Verify your email.
                </h1>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Confirming your email helps secure your account and unlocks
                  full access to your profile.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-zinc-200">
                  One-click verify
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Open the link from your signup email. Verification runs
                  automatically when you land here.
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

              {status === "loading" || status === "idle" ? (
                <VerifyState
                  icon="loading"
                  title="Verifying your email"
                  description="Please wait while we confirm your account..."
                />
              ) : null}

              {status === "success" ? (
                <VerifyState
                  icon="success"
                  title="Email verified!"
                  description="Your account is now verified. You can access your full profile and features."
                >
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/profile"
                      className="inline-flex flex-1 items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                    >
                      Go to profile
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                    >
                      Sign in
                    </Link>
                  </div>
                </VerifyState>
              ) : null}

              {status === "error" ? (
                <VerifyState
                  icon="error"
                  title="Verification failed"
                  description={errorMessage}
                >
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {token ? (
                      <button
                        type="button"
                        onClick={() => verifyEmail(token)}
                        className="inline-flex flex-1 items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                      >
                        Try again
                      </button>
                    ) : null}
                    <Link
                      href="/profile"
                      className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                    >
                      Back to profile
                    </Link>
                  </div>
                </VerifyState>
              ) : null}

              {status === "missing" ? (
                <VerifyState
                  icon="error"
                  title="Missing verification link"
                  description="No token was found in the URL. Open the verification link from your signup email, or request a new one from your profile."
                >
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/profile"
                      className="inline-flex flex-1 items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                    >
                      Go to profile
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                    >
                      Sign up
                    </Link>
                  </div>
                </VerifyState>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function VerifyState({
  icon,
  title,
  description,
  children,
}: {
  icon: "loading" | "success" | "error";
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const iconStyles = {
    loading: "border-zinc-700 bg-zinc-800 text-emerald-400",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
  };

  return (
    <div className="text-center sm:text-left">
      <div
        className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border sm:mx-0 ${iconStyles[icon]}`}
      >
        {icon === "loading" ? (
          <svg
            className="h-7 w-7 animate-spin"
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
        ) : icon === "success" ? (
          <svg
            className="h-7 w-7"
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
        ) : (
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
      <p className="text-sm font-medium text-emerald-400">Email verification</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      {children}
    </div>
  );
}
