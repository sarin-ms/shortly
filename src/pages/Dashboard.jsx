import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    supabase
      .from("urls")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLinks(data || []);
        setLoading(false);
      });
  }, []);

  const handleCopy = (link) => {
    navigator.clipboard.writeText(`${window.location.origin}/${link.short_code}`);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    await supabase.from("urls").delete().eq("id", id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(200,240,96,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,240,96,0.03)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none z-0" />

      <header className="relative z-10 flex items-center gap-5 px-8 py-5 border-b border-neutral-800">
        <Link to="/" className="font-sans font-extrabold text-xl tracking-tight">
          short<span className="text-lime-400">ly</span>
        </Link>
        <span className="text-neutral-500 text-sm">/ My Links</span>
        <Link to="/" className="ml-auto text-sm text-neutral-500 hover:text-lime-400 transition-colors">
          Home →
        </Link>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-neutral-500 text-sm">Loading...</p>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-neutral-500">No links yet.</p>
            <Link to="/" className="text-lime-400 text-sm hover:underline">
              Shorten your first URL →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((link, i) => (
              <div
                key={link.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col gap-2 hover:border-neutral-700 transition-colors animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={`${window.location.origin}/${link.short_code}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lime-400 text-sm font-medium hover:underline"
                  >
                    {window.location.host}/{link.short_code}
                  </a>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(link)}
                      className="text-xs border border-neutral-700 text-neutral-400 rounded-md px-3 py-1 hover:border-neutral-500 hover:text-neutral-200 transition-all"
                    >
                      {copiedId === link.id ? "✓" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-xs border border-neutral-700 text-neutral-400 rounded-md px-3 py-1 hover:border-red-500 hover:text-red-400 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 truncate">{link.original_url}</p>

                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <span className="text-lime-400/60">{link.click_count} clicks</span>
                  <span>·</span>
                  <span>{formatDate(link.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}