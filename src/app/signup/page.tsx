"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Account created");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;

      console.log("Signup failed", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      user.username.trim().length === 0 ||
        user.email.trim().length === 0 ||
        user.password.length === 0,
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
                Create your secure account.
              </h1>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                Sign up to continue into your profile dashboard and verify your
                email address.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-sm font-medium text-zinc-200">
                Verification ready
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                A confirmation link is sent after signup so the account can be
                activated.
              </p>
            </div>
          </section>

          <main className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="text-sm font-medium text-emerald-400">
                  Get started
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  Sign up
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Enter your details to create a new account.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-zinc-300"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        username: e.target.value,
                      })
                    }
                    placeholder="kamran"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-zinc-300"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-zinc-300"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter a strong password"
                  />
                </div>

                <button
                  onClick={onSignup}
                  disabled={buttonDisabled || loading}
                  className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {loading
                    ? "Creating account..."
                    : buttonDisabled
                      ? "Fill all fields"
                      : "Create account"}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link
                  className="font-medium text-emerald-400 hover:text-emerald-300"
                  href="/login"
                >
                  Log in
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
