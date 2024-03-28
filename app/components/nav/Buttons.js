import { saveImage } from "../../utils";

const Buttons = ({ activeMask, clearPaths, setActiveMask, setIsEditing }) => {
  return (
    <>
      <button
        className="control control--button"
        onClick={() => {
          saveImage();
        }}
        title="Save image to your machine"
      >
        Save image
      </button>
      {activeMask && (
        <button
          className="control control--button"
          onClick={() => {
            setActiveMask(activeMask);
            setIsEditing(true);
          }}
          title="Edit the mask you just drawn on your face"
        >
          Edit mask
        </button>
      )}

      <button
        className="control control--button"
        title="Clear what you've just drawn (you can also wag your finger)"
        onClick={clearPaths}
      >
        Clear image
      </button>
      <button
        className="control control--button"
        title="Reset all settings to defaults"
        onClick={() => {
          sessionStorage.clear();
          window.location = "/";
        }}
      >
        Reset all
      </button>
    </>
  );
};

export default Buttons;
