import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Flappy School
        </h1>
        <p className="text-slate-400 text-lg">
          Tap or press Space to fly. Avoid the pipes!
        </p>

        <Link
          href="/play"
          className="inline-block px-12 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition-all hover:scale-105 active:scale-95"
        >
          Start Game
        </Link>
      </div>
    </main>
  );
}
