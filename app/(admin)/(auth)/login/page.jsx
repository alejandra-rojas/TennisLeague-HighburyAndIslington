"use client";
import "../../../styles/Admin/Login.scss";
import { createClient } from "@/supabase/client";
import { useState } from "react";

//Components
import AuthForm from "../AuthForm";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    }
    if (!error) {
      router.push("/admin");
    }
  };

  return (
    <main id="auth">
      <div className="login-form">
        <h2>Admin log in</h2>
        <AuthForm handleSubmit={handleSubmit} />
        {error && <div className="error">{error}</div>}
      </div>
    </main>
  );
}

