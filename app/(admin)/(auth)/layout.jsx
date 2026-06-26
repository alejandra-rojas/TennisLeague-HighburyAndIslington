import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

//Components
import AuthPrimaryNavbar from "../../components/AuthPrimaryNavbar";

export default async function AuthLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <>
      <AuthPrimaryNavbar />
      {children}
    </>
  );
}
