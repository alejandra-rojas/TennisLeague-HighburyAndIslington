"use client";
import "../../../styles/Admin/Login.scss";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [errorTimer, setErrorTimer] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e, email) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (errorTimer) {
      clearTimeout(errorTimer);
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const supabase = createClientComponentClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://leagues-dashboard.vercel.app/",
    });
    if (error) {
      if (error.message === "Email rate limit exceeded") {
        setError("Email rate limit exceeded. Try again in a minute.");
      } else {
        setError(error.message);
      }

      const timerId = setTimeout(() => {
        setError("");
        setLoading(false);
      }, 1500);
      setErrorTimer(timerId);
    } else if (data) {
      router.push("/verify-email");
      setLoading(false);
    }
  };

  return (
    <main id="auth">
      <div className="login-form">
        <h2>Request a password reset</h2>
        <form id="admin-login-form" onSubmit={(e) => handleSubmit(e, email)}>
          <div className="form-input">
            <label>Email address</label>
            <input
              type="email"
              onChange={handleEmailChange}
              value={email}
              required
            />
          </div>

          <button disabled={loading || email === ""}>Submit</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </main>
  );
}
