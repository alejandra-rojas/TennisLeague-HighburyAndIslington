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

    const token = router.query.token;

    if (!token) {
      setError("Invalid or expired token");
      return;
    }

    const { error } = await supabase.auth.updateUser(token, {
      password: password,
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
