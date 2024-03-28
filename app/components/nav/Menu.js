import DEFAULT_SETUP from "../../_setup.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
import Info from "./Info";
import ScenarioSelection from "./ScenarioSelection";
import ScratchPointSelection from "./ScratchPointSelection";

const Menu = (props) => {
  const {
    setup,
    setSetup,
    handleInputChange,
    clearPaths,
  } = props;
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
        <Info {...{ setup }} />
      </nav>
      <nav className={`menu menu--secondary`}>
        <ScenarioSelection {...{ setup, setSetup, handleInputChange }} />
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
          <ScratchPointSelection {...{ setup, handleInputChange }} />
        )}
      </nav>
    </>
  );
};

export default Menu;
