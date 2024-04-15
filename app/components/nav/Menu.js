import DEFAULT_SETUP from "../../_setup.json";
import DEFAULT_SCENARIOS from "../../data/scenarios.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
import Scenarios from "./Scenarios";
import Scratch from "../scratch/Scratch";

const Menu = (props) => {
  const { setup, setSetup, handleInputChange, clearPaths } = props;
  const { pattern, isScratchCanvas } = setup;
  return (
    <>
      <nav className={`menu menu--controls`}>
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
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
      </nav>
      <nav className={`menu menu--secondary`}>
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentPattern ||
                control.parentPattern.includes(pattern)) &&
              control.isHandRelated &&
              (isScratchCanvas || !control.isScratchCanvasRelated)
          )}
        />
        {isScratchCanvas && pattern === "canvas" && (
          <Scratch {...{ setup, handleInputChange }} />
        )}
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
    </>
  );
};

export default Menu;
