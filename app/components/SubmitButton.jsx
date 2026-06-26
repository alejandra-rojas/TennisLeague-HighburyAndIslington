"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending && <span>Submitting..</span>}
      {!pending && <span>Submit</span>}
    </button>
  );
}
