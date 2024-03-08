import React from "react";
import "../../../styles/Admin/Login.scss";

export default function Verify() {
  return (
    <main className="text-center h-screen translate-y-1/4">
      <h2 className="uppercase font-bold text-xl pb-4 ">
        We have received your request
      </h2>
      <p>
        An email has been sent to your email provider. <br />
        Follow the provided link so we can complete your request.
      </p>
    </main>
  );
}
