"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAvatarUrl,
  PROFILE_COVER_IMAGE,
  type UserProfile,
} from "@/lib/profile";

const features = [
  {
    title: "Secure signup & login",
    description: "JWT sessions with HTTP-only cookies and bcrypt password hashing.",
  },
  {
    title: "Email verification",
    description: "Confirm your account with a one-click link sent to your inbox.",
  },
  {
    title: "Password recovery",
    description: "Reset forgotten passwords safely with expiring email tokens.",
  },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    try {
      setLoggingOut(true);
      await axios.get("/api/users/logout");
      setUser(null);
      toast.success("Signed out successfully");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500/10 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/30">
              A
            </span>
            <span className="text-sm font-semibold tracking-wide text-white">
              Auth Next.js
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-zinc-800" />
            ) : user ? (
              <>
                <Link
                  href="/profile"
                  className="hidden rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:text-white sm:inline"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  disabled={loggingOut}
                  className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-60"
                >
                  {loggingOut ? "..." : "Sign out"}
                </button>
                <Link
                  href="/profile"
                  className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-emerald-500/30"
                >
                  <Image
                    src={getAvatarUrl(user.username)}
                    alt={user.username}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-zinc-800">
          <div className="absolute inset-0">
            <Image
              src={PROFILE_COVER_IMAGE}
              alt=""
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/90 to-zinc-950" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
              Full-stack authentication
            </p>
            {loading ? (
              <div className="mt-6 space-y-4">
                <div className="h-12 w-3/4 max-w-lg animate-pulse rounded-lg bg-zinc-800" />
                <div className="h-5 w-full max-w-xl animate-pulse rounded bg-zinc-800" />
              </div>
            ) : user ? (
              <>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Welcome back, {user.username}.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
                  You&apos;re signed in as{" "}
                  <span className="font-medium text-zinc-200">{user.email}</span>
                  . Head to your dashboard to manage your account.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    Open dashboard
                  </Link>
                  <Link
                    href={`/profile/${user._id}`}
                    className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                  >
                    Public profile
                  </Link>
                </div>
                {!user.isVerified && (
                  <p className="mt-4 text-sm text-amber-400">
                    Your email is not verified yet.{" "}
                    <Link
                      href="/verifyemail"
                      className="font-medium underline hover:text-amber-300"
                    >
                      Check your inbox
                    </Link>
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Authentication built for modern Next.js apps.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
                  Sign up, verify your email, sign in securely, and recover your
                  password — all with a polished, production-ready flow.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium text-emerald-400">Features</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Everything you need for auth
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              This project includes signup, login, protected routes, email
              verification, and password reset out of the box.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-zinc-700"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <svg
                    className="h-5 w-5"
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
                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-800 bg-zinc-900/40">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Ready to get started?
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Create an account in seconds or sign in to continue.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {!user && !loading && (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    Sign up free
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex rounded-md border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50"
                  >
                    Sign in
                  </Link>
                </>
              )}
              {user && !loading && (
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="inline-flex rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                >
                  Go to dashboard
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Auth Next.js</p>
          <div className="flex gap-4">
            <Link href="/login" className="transition hover:text-zinc-300">
              Login
            </Link>
            <Link href="/signup" className="transition hover:text-zinc-300">
              Signup
            </Link>
            <Link
              href="/forgotPassword"
              className="transition hover:text-zinc-300"
            >
              Forgot password
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
