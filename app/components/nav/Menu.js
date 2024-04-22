import CONTROLS from "../../data/controls.json";
import DEFAULT_SCENARIOS from "../../data/scenarios.json";
import Controls from "./Controls";
import Buttons from "./Buttons";
import Scenarios from "./Scenarios";
import ShapeSelection from "./ShapeSelection";

const Menu = (props) => {
  const { setup, setSetup, handleInputChange, clearPaths } = props;
  const { pattern, isScratchCanvas } = setup;
  return (
    <>
      <nav className={`menu menu--controls`}>
        <Controls
          {...{ setup, handleInputChange }}
          controls={CONTROLS.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentPattern ||
                control.parentPattern.includes(pattern)) &&
              !control.isHandRelated
          )}
        />
        <Buttons {...{ setup, handleInputChange, clearPaths }} />
        <Scenarios
          {...{
            setup,
            setSetup,
            handleInputChange,
            scenarios: DEFAULT_SCENARIOS,
            title: "Scenarios"
          }}
        />
        <Scenarios
          {...{
            setup,
            setSetup,
            handleInputChange,
            scenarios: setup.customScenarios,
            title: "Custom scenarios"
          }}
        />
      </nav>
      <nav className={`menu menu--secondary`}>
        <Controls
          {...{ setup, handleInputChange }}
          controls={CONTROLS.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentPattern ||
                control.parentPattern.includes(pattern)) &&
              control.isHandRelated &&
              (isScratchCanvas || !control.isScratchCanvasRelated)
          )}
        />
        {isScratchCanvas && pattern === "canvas" && (
          <ShapeSelection {...{ setup, handleInputChange }} />
        )}
      </nav>
    </>
  );
};

export default Menu;
