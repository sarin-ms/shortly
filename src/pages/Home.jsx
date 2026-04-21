    import { useState } from "react";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const handleShorten = async () => {
    setError("");
    setResult(null);
    if (!url.trim()) return setError("Please enter a URL.");
    if (!isValidUrl(url)) return setError("Invalid URL — make sure to include https://");

    const shortCode = alias.trim() || nanoid(6);
    setLoading(true);

    if (alias.trim()) {
      const { data: existing } = await supabase
        .from("urls")
        .select("short_code")
        .eq("short_code", alias.trim())
        .single();
      if (existing) {
        setLoading(false);
        return setError("That alias is already taken. Try another.");
      }
    }

    const { data, error: insertError } = await supabase
      .from("urls")
      .insert([{ short_code: shortCode, original_url: url, click_count: 0 }])
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
    } else {
      setResult(`${window.location.origin}/${data.short_code}`);
      setUrl("");
      setAlias("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono flex flex-col">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(200,240,96,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,240,96,0.03)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none z-0" />

      <header className="relative z-10 flex justify-between items-center px-8 py-5 border-b border-neutral-800">
        <span className="font-sans font-extrabold text-2xl tracking-tight">
          short<span className="text-lime-400">ly</span>
        </span>
        <Link to="/dashboard" className="text-sm text-neutral-500 hover:text-lime-400 transition-colors">
          My Links →
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 gap-12">
        <div className="text-center">
          <h1 className="font-sans font-extrabold text-5xl sm:text-7xl leading-none tracking-tighter">
            Long URLs,<br />
            <em className="not-italic text-lime-400">cut short.</em>
          </h1>
          <p className="mt-4 text-neutral-500 text-sm">Paste your link. Get something clean.</p>
        </div>

        <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-500 uppercase tracking-widest">Your long URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              placeholder="https://example.com/very/long/path"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-lime-400 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-500 uppercase tracking-widest">
              Custom alias <span className="text-neutral-700 normal-case">(optional)</span>
            </label>
            <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden focus-within:border-lime-400 transition-colors">
              <span className="px-3 py-3 text-sm text-neutral-500 border-r border-neutral-700 whitespace-nowrap">
                {window.location.host}/
              </span>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value.replace(/\s/g, "-"))}
                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                placeholder="my-link"
                className="flex-1 bg-transparent px-3 py-3 text-sm text-neutral-100 placeholder-neutral-600 outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm -mt-2">{error}</p>}

          <button
            onClick={handleShorten}
            disabled={loading}
            className="bg-lime-400 text-neutral-950 font-sans font-bold text-base rounded-lg py-3 hover:bg-lime-300 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Shorten URL"
            )}
          </button>

          {result && (
            <div className="flex items-center justify-between gap-3 bg-lime-400/10 border border-lime-400/20 rounded-lg px-4 py-3 animate-in fade-in">
              <a
                href={result}
                target="_blank"
                rel="noreferrer"
                className="text-lime-400 text-sm hover:underline break-all"
              >
                {result}
              </a>
              <button
                onClick={handleCopy}
                className="shrink-0 border border-lime-400/30 text-lime-400 text-xs rounded-md px-3 py-1.5 hover:bg-lime-400/10 hover:border-lime-400 transition-all"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 text-center text-xs text-neutral-700 py-5 border-t border-neutral-900">
        Built with React + Supabase
      </footer>
    </div>
  );
}