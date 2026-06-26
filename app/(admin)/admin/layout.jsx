import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

//Components
import LoginNavbar from "../../components/LoginNavbar";
import AdminNavbar from "../../components/AdminNavbar";
import AuthPrimaryNavbar from "../../components/AuthPrimaryNavbar";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <header id="admin-header">
        <LoginNavbar user={user} />
        <AuthPrimaryNavbar />
        <AdminNavbar />
      </header>
      {children}
    </>
  );
}
