"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rf_dark") === "1";
    setDark(stored);
    document.body.classList.toggle("dark", stored);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.body.classList.toggle("dark", next);
    localStorage.setItem("rf_dark", next ? "1" : "0");
  }

  return (
    <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full bg-linen text-forest-900 shadow-inset" aria-label="Darstellung wechseln">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
