import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseWithToken, isSupabaseConfigured, supabase } from "@/lib/supabase";

const ACCESS_COOKIE = "rf-access-token";
const REFRESH_COOKIE = "rf-refresh-token";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
};

export async function setSessionCookies(session: Session) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE, session.access_token, {
    ...cookieOptions,
    maxAge: session.expires_in
  });
  cookieStore.set(REFRESH_COOKIE, session.refresh_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;

  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) return null;

  return data.user;
}

export async function requireUser() {
  if (!isSupabaseConfigured) return null;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return user;
}

export async function getUserSupabase() {
  if (!isSupabaseConfigured) return { client: null, user: null };

  const user = await requireUser();
  const accessToken = await getAccessToken();

  return {
    client: createSupabaseWithToken(accessToken),
    user
  };
}
