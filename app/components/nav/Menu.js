import DEFAULT_SETUP from "../../_setup.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
import Scenarios from "./Scenarios";
import Scratch from "../scratch/Scratch";

const Menu = (props) => {
  const { setup, setSetup, handleInputChange, clearPaths } = props;
  const { pattern, isScratchCanvas } = setup;
  const defaultScenariosLength = 1;
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
        <Scenarios {...{ setup, setSetup, handleInputChange }} />
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
      </nav>
    </>
  );
};

export default Menu;
