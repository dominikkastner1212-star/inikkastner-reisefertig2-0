"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function PendingButton({
  children,
  pendingText = "Speichern...",
  className
}: {
  children: ReactNode;
  pendingText?: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button className={`${className} pressable disabled:cursor-wait disabled:opacity-75`} disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}
