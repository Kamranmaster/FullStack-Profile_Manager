import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          Profile not found
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          This user does not exist or the link may be incorrect.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-flex rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
