import DEFAULT_SETUP from "../../_setup.json";
import { saveImage } from "../../utils";

const Buttons = ({ setup, handleInputChange, clearPaths }) => {
  const saveSetup = () => {
    const filteredSetup = Object.fromEntries(
      Object.entries(setup).filter(([key]) => {
        const entry = DEFAULT_SETUP.find((item) => item.id === key);
        return entry && !entry.isOmittedInScenario && !entry.isStoringPrevented;
      })
    );
    const customScenariosLength = Object.keys(setup.customScenarios).length;
    const newCustomScenarioKey = customScenariosLength + 1;
    const newCustomScenarios = {
      ...setup.customScenarios,
      [newCustomScenarioKey]: filteredSetup
    };
    handleInputChange({
      target: {
        id: "customScenarios",
        value: newCustomScenarios,
        type: "hidden"
      }
    });
  };

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

      <button
        className="control control--button"
        onClick={() => {
          saveSetup(setup);
        }}
        title="Save setup"
      >
        Save setup
      </button>

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
          window.location.reload();
        }}
      >
        Reset all
      </button>
    </>
  );
};

export default Buttons;
