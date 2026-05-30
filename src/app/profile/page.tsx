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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/me");
      setUser(res.data.data);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : "Failed to load profile";
      toast.error(message);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      setLoggingOut(true);
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : error instanceof Error
            ? error.message
            : "Logout failed";
      toast.error(message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30 md:grid-cols-[0.85fr_1.15fr]">
          <section className="relative hidden min-h-[520px] md:block">
            <Image
              src={PROFILE_COVER_IMAGE}
              alt="Abstract profile cover"
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
                <h1 className="mt-5 text-3xl font-semibold leading-tight text-white">
                  Your dashboard
                </h1>
                <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
                  Manage your account, verify your email, and view your public
                  profile page.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-zinc-200">
                  Account security
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Keep your email verified and sign out when using a shared
                  device.
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
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Your dashboard
                </h2>
              </div>

              {loading ? (
                <ProfileSkeleton />
              ) : user ? (
                <>
                  <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/40 ring-4 ring-emerald-500/10">
                      <Image
                        src={getAvatarUrl(user.username)}
                        alt={`${user.username} avatar`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-5">
                      <h2 className="text-2xl font-semibold text-white">
                        {user.username}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                        <StatusBadge
                          label={user.isVerified ? "Verified" : "Unverified"}
                          variant={user.isVerified ? "success" : "warning"}
                        />
                        {user.isAdmin && (
                          <StatusBadge label="Admin" variant="accent" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <InfoRow label="User ID" value={user._id} mono />
                    <InfoRow label="Username" value={user.username} />
                    <InfoRow label="Email" value={user.email} />
                    <InfoRow
                      label="Email status"
                      value={user.isVerified ? "Verified" : "Pending verification"}
                    />
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href={`/profile/${user._id}`}
                      className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                    >
                      View public profile
                    </Link>

                    {!user.isVerified && (
                      <Link
                        href="/verifyemail"
                        className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                      >
                        Verify email
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={logout}
                      disabled={loggingOut}
                      className="inline-flex items-center justify-center rounded-md border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start">
        <div className="h-24 w-24 rounded-full bg-zinc-800" />
        <div className="mt-4 space-y-3 sm:mt-0 sm:ml-5">
          <div className="h-7 w-40 rounded bg-zinc-800" />
          <div className="h-4 w-52 rounded bg-zinc-800" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-zinc-800" />
            <div className="h-6 w-16 rounded-full bg-zinc-800" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-14 rounded-md bg-zinc-800" />
        <div className="h-14 rounded-md bg-zinc-800" />
        <div className="h-14 rounded-md bg-zinc-800" />
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "success" | "warning" | "accent";
}) {
  const styles = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    accent: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/80 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 text-sm text-zinc-200 ${mono ? "break-all font-mono text-xs" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
