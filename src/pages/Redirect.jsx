import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Redirect() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Looking up your link...");

  useEffect(() => {
    const redirect = async () => {
      const { data, error } = await supabase
        .from("urls")
        .select("id, original_url, click_count")
        .eq("short_code", code)
        .single();

      if (error || !data) {
        navigate("/404", { replace: true });
        return;
      }

      await supabase
        .from("urls")
        .update({ click_count: data.click_count + 1 })
        .eq("id", data.id);

      setStatus(`Redirecting...`);
      window.location.href = data.original_url;
    };

    redirect();
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4 font-mono text-sm text-neutral-500">
      <span className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      <p>{status}</p>
    </div>
  );
}
