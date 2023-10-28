import SubmitButton from "@/app/components/SubmitButton";
import { createPlayer } from "./actions";

function NewPlayer() {
  return (
    <form action={createPlayer}>
      <label>
        <span>First name:</span>
        <input required type="text" name="first-name" />
      </label>
      <label>
        <span>Last name:</span>
        <input required type="text" name="last-name" />
      </label>
      <SubmitButton />
    </form>
  );
}

export default NewPlayer;
