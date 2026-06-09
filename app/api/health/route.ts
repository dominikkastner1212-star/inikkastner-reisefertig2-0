import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export function GET() {
  return NextResponse.json({
    app: "reisefertig2-0",
    status: "ready",
    supabaseConfigured: isSupabaseConfigured
  });
}
