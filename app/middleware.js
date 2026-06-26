import { updateSession } from "@/supabase/middleware";

export async function middleware(request) {
  return updateSession(request);
}
