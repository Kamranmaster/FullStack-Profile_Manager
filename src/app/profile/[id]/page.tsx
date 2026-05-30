import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import {
  getAvatarUrl,
  PROFILE_COVER_IMAGE,
} from "@/lib/profile";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connect();
  const { id } = await params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    notFound();
  }

  const username = user.username as string;
  const email = user.email as string;
  const isVerified = Boolean(user.isVerified);
  const isAdmin = Boolean(user.isAdmin);

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
                  Public profile
                </p>
                <h1 className="mt-5 text-3xl font-semibold leading-tight text-white">
                  @{username}
                </h1>
                <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
                  This is the shareable profile view for this account.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-zinc-200">
                  Profile ID
                </p>
                <p className="mt-2 break-all font-mono text-xs leading-5 text-zinc-500">
                  {id}
                </p>
              </div>
            </div>
          </section>

          <main className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <Link
                href="/profile"
                className="mb-6 inline-flex items-center text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
              >
                ← Back to dashboard
              </Link>

              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/40 ring-4 ring-emerald-500/10">
                  <Image
                    src={getAvatarUrl(username)}
                    alt={`${username} avatar`}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-5">
                  <p className="text-sm font-medium text-emerald-400">
                    Member profile
                  </p>
                  <h2 className="mt-1 text-3xl font-semibold text-white">
                    {username}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">{email}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <StatusBadge
                      label={isVerified ? "Verified" : "Unverified"}
                      variant={isVerified ? "success" : "warning"}
                    />
                    {isAdmin && (
                      <StatusBadge label="Admin" variant="accent" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <InfoRow label="Username" value={username} />
                <InfoRow label="Email" value={email} />
                <InfoRow
                  label="Email status"
                  value={isVerified ? "Verified account" : "Not verified yet"}
                />
                <InfoRow label="Role" value={isAdmin ? "Administrator" : "Member"} />
              </div>

              <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-md border border-zinc-700">
                    <Image
                      src={PROFILE_COVER_IMAGE}
                      alt="Profile banner preview"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      Profile banner
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Avatar generated from username. Cover uses your app theme
                      artwork.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/profile"
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                >
                  Go to your dashboard
                </Link>
                <Link
                  href="/login"
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/50 hover:text-emerald-400"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </main>
        </div>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/80 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-zinc-200">{value}</p>
    </div>
  );
}
