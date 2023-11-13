"use client";
import "../../../styles/Admin/Login.scss";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Reset() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (error) setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const supabase = createClientComponentClient();

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else if (data) {
      router.push("/admin");
    }
  };

  return (
    <main id="auth">
      <div className="login-form">
        <h2>Reset your password</h2>

        <form id="reset-password-form" onSubmit={handleSubmit}>
          <div className="form-input">
            <label>New Password</label>
            <input
              type="password"
              onChange={handleNewPasswordChange}
              value={newPassword}
              required
            />
          </div>

          <div className="form-input">
            <label>Confirm new Password</label>
            <input
              type="password"
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
              required
            />
          </div>

          <button disabled={newPassword !== confirmPassword || error}>
            Submit
          </button>
        </form>

        {error && <div className="error">{error}</div>}
      </div>
    </main>
  );
}
