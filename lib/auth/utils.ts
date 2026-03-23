import { supabase } from "@/lib/supabase/client";

export type AuthError = { message: string };

export async function signUp(
  email: string,
  password: string
): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: { message: "Supabase is not configured." } };
  }

  const { error } = await supabase.auth.signUp({ email, password });
  return { error: error ? { message: error.message } : null };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: { message: "Supabase is not configured." } };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? { message: error.message } : null };
}

export async function signOut(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function getSession() {
  if (!supabase) return { data: { session: null }, error: null };
  return supabase.auth.getSession();
}

export async function getUser() {
  if (!supabase) return { data: { user: null }, error: null };
  return supabase.auth.getUser();
}
