import { supabase } from "./client";

export async function getProfile(userId: string) {
  if (!supabase) return { data: null, error: null };
  return supabase.from("profiles").select("username").eq("id", userId).single();
}

export async function updateUsername(username: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not logged in" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: username.trim() || null, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
