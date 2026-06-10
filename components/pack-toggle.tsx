"use client";

import { useState } from "react";
import { togglePackItem } from "@/lib/actions";
import type { PackItem } from "@/lib/types";

export function PackToggle({ item }: { item: PackItem }) {
  const [done, setDone] = useState(item.done);
  const [pending, setPending] = useState(false);

  async function toggle(formData: FormData) {
    const nextDone = !done;
    setDone(nextDone);
    setPending(true);
    try {
      await togglePackItem(formData);
    } catch {
      setDone(!nextDone);
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={toggle}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="done" value={String(done)} />
      <button
        className="pressable flex min-h-[3.25rem] w-full items-center justify-between rounded-xl border border-forest-700/10 bg-linen/70 px-3 py-3 text-left transition-colors hover:bg-forest-50 disabled:cursor-wait disabled:opacity-80"
        disabled={pending}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs transition-colors ${done ? "border-forest-700 bg-forest-700 text-linen" : "border-forest-700/30"}`}>
            {done ? "✓" : ""}
          </span>
          <span className={`truncate text-sm font-medium text-forest-900 transition-opacity ${done ? "opacity-58" : ""}`}>{item.label}</span>
        </div>
        {item.priority === "hoch" ? <span className="ml-3 rounded-full bg-clay/55 px-2 py-1 text-[0.65rem] font-semibold text-forest-900">wichtig</span> : null}
      </button>
    </form>
  );
}
