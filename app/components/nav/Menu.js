import DEFAULT_SETUP from "../../_setup.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
import ScenarioSelection from "./ScenarioSelection";
import ScratchPoints from "./ScratchPoints";

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
        <Buttons {...{ clearPaths }} />
        <ScenarioSelection {...{ setup, setSetup, handleInputChange }} />
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
          <ScratchPoints {...{ setup, handleInputChange }} />
        )}
      </nav>
    </>
  );
};

export default Menu;
