import { XMarkIcon } from "@heroicons/react/24/outline";
import DeleteButton from "./DeleteButton";

function EditTeamModal({ id, setShowEditModal }) {
  return (
    <>
      <DeleteButton id={id} />
      <button
        onClick={() => {
          setShowEditModal(false);
        }}
        className="exit"
      >
        <XMarkIcon width={25} />
        <span>exit</span>
      </button>
    </>
  );
}

export default EditTeamModal;
