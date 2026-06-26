import { updateSession } from "@/supabase/middleware";

export async function proxy(request) {
  return updateSession(request);
}
