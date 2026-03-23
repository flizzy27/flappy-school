import { supabase } from "./client";

const LEADERBOARD_LIMIT = 50;

export interface LeaderboardEntry {
  id: string;
  score: number;
  created_at: string;
  username: string | null;
  rank?: number;
}

export interface SaveScoreResult {
  success: boolean;
  error?: string;
}

export async function saveHighscore(score: number): Promise<SaveScoreResult> {
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

  const { error } = await supabase.from("highscores").insert({
    user_id: user.id,
    score,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) {
    return [];
  }

  const { data: scoresData, error: scoresError } = await supabase
    .from("highscores")
    .select("id, user_id, score, created_at")
    .order("score", { ascending: false })
    .limit(LEADERBOARD_LIMIT);

  if (scoresError || !scoresData?.length) {
    return [];
  }

  const userIds = [...new Set(scoresData.map((s) => s.user_id))];
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  const profileMap = new Map(
    (profilesData ?? []).map((p) => [p.id, p.username ?? null])
  );

  return scoresData.map((row, index) => ({
    id: row.id,
    score: row.score,
    created_at: row.created_at,
    username: profileMap.get(row.user_id) ?? null,
    rank: index + 1,
  }));
}
