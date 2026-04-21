import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4 font-mono text-center px-6">
      <span className="font-sans font-extrabold text-5xl text-lime-400 tracking-tight">404</span>
      <p className="text-neutral-500 text-sm">This link doesn't exist or may have expired.</p>
      <Link to="/" className="text-lime-400 text-sm hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}