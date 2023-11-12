"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Reset() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e, password) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const supabase = createClientComponentClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
    });

    if (error) {
      setError(error.message);
    }
    if (!error) {
      router.push("/admin");
    }
  };

  return (
    <main>
      <h2>Reset your password</h2>

      <form id="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-input">
          <label>New Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <div className="form-input">
          <label>Confirm new Password</label>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
        </div>

        <button>Submit</button>
      </form>

      {error && <div className="error">{error}</div>}
    </main>
  );
}
