import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-cyan-400">Settings</h1>
        <p className="text-slate-400">
          Theme, sound, and skin options will go here.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-200 text-sm"
        >
          ← Back
        </Link>
      </div>
    </main>
  );
}
