import CONTROLS from "../../data/controls.json";
import { saveImage } from "../../utils";
import { ISetup, UpdateSetupType } from "../../../types";

interface IProps {
  setup: ISetup;
  updateSetup: (event: UpdateSetupType) => void;
  clearPaths: () => void;
}

const Buttons: React.FC<IProps> = ({ setup, updateSetup, clearPaths }) => {
  const saveSetup = () => {
    const filteredSetup = Object.fromEntries(
      Object.entries(setup).filter(([key]) => {
        const entry = CONTROLS.find((item) => item.id === key);
        return entry && !entry.isOmittedInPattern && !entry.isStoringPrevented;
      })
    );
    const customPatternsLength = Object.keys(setup.customPatterns || {}).length;
    const newCustomPatternKey = customPatternsLength + 1;
    const newCustomPatterns = {
      ...setup.customPatterns,
      [newCustomPatternKey]: filteredSetup
    };
    updateSetup({
      id: "customPatterns",
      value: newCustomPatterns,
      type: "hidden"
    });
  };

  return (
    <>
      <button
        className="control button"
        onClick={() => {
          saveImage();
        }}
        title="Save image to your machine"
      >
        Save image
      </button>

      <button
        className="control button cancel"
        title="Clear what you've just drawn (you can also wag your finger)"
        onClick={clearPaths}
      >
        Clear image
      </button>

      <button
        className="control button cancel"
        title="Reset all settings to defaults"
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
      >
        Reset all
      </button>

      <button
        className="control button"
        onClick={() => {
          saveSetup();
        }}
        title="Save setup"
      >
        Save setup
      </button>
    </>
  );
};

export default Buttons;
