import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//Components
import LoginNavbar from "@/app/components/LoginNavbar";
import AdminNavbar from "../../components/AdminNavbar";
import AuthPrimaryNavbar from "@/app/components/AuthPrimaryNavbar";

export default async function AdminLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/login");
  }

  return (
    <>
      <header id="admin-header">
        <LoginNavbar user={data.session.user} />
        <AuthPrimaryNavbar />
        <AdminNavbar />
      </header>
      {children}
    </>
  );
}
