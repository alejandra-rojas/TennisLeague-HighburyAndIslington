"use client";

import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/");
    }
    if (error) {
      console.log(error);
    }
  };

  return <button onClick={handleLogout}>Log Out</button>;
}

