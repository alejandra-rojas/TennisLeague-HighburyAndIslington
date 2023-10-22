"use client";
import { useState } from "react";

export default function AuthForm({ handleSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      id="admin-login-form"
      onSubmit={(e) => handleSubmit(e, email, password)}
    >
      <div className="form-input">
        <label>Email address</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>

      <div className="form-input">
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </div>

      <button>Submit</button>
    </form>
  );
}
