"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-2xl bg-forest-50 p-3">
      <p className="text-xs font-semibold text-forest-900/58">Einladungslink</p>
      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
        <input
          readOnly
          value={url}
          className="min-w-0 rounded-xl border border-forest-700/10 bg-linen px-3 text-xs text-forest-900 outline-none"
          aria-label="Einladungslink"
        />
        <button
          type="button"
          onClick={copyLink}
          className="pressable inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cream px-3 text-xs font-semibold text-forest-900"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Kopiert" : "Kopieren"}
        </button>
      </div>
    </div>
  );
}
