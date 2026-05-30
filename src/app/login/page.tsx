"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (buttonDisabled || loading) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Welcome back!");
      router.push("/profile");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : error instanceof Error
            ? error.message
            : "Something went wrong";
      console.log("Login failed", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      user.email.trim().length === 0 || user.password.length === 0,
    );
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30 md:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden border-r border-zinc-800 bg-zinc-950 p-8 md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
                Auth Next.js
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white">
                Welcome back.
              </h1>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                Sign in to access your profile, manage your account, and pick up
                where you left off.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-sm font-medium text-zinc-200">
                Secure sessions
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Your session is protected with an HTTP-only cookie after a
                successful login.
              </p>
            </div>
          </section>

          <main className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 md:hidden">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Auth Next.js
                </p>
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium text-emerald-400">
                  Sign in
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  Log in
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Use your email or username and password to continue.
                </p>
              </div>

              <form className="space-y-5" onSubmit={onLogin}>
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-zinc-300"
                    htmlFor="email"
                  >
                    Email or username
                  </label>
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    id="email"
                    type="text"
                    autoComplete="username"
                    value={user.email}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      className="text-sm font-medium text-zinc-300"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link
                      className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                      href="/forgotPassword"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={buttonDisabled || loading}
                  className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {loading
                    ? "Signing in..."
                    : buttonDisabled
                      ? "Fill in your credentials"
                      : "Sign in"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-medium text-emerald-400 hover:text-emerald-300"
                  href="/signup"
                >
                  Create one
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
