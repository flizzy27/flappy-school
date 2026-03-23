import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      {
        connected: false,
        error: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local in the project root.",
      },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return NextResponse.json({
      connected: true,
      message: "Supabase connection OK",
      hasSession: !!data.session,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        connected: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
