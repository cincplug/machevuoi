import DEFAULT_SETUP from "../../_setup.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
import Info from "./Info";
import MaskSelection from "./MaskSelection";
import ScenarioSelection from "./ScenarioSelection";
import ScratchPointSelection from "./ScratchPointSelection";

const Menu = (props) => {
  const {
    setup,
    setSetup,
    handleInputChange,
    activeMask,
    setActiveMask,
    clearPaths,
    setIsEditing
  } = props;
  const { showsFaces, pattern, isScratchCanvas } = setup;
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
              !control.isHandRelated &&
              !control.isFaceRelated
          )}
        />
        <Buttons {...{ activeMask, clearPaths, setActiveMask, setIsEditing }} />
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
              ((control.isHandRelated &&
                !showsFaces &&
                (isScratchCanvas || !control.isScratchCanvasRelated)) ||
                (control.isFaceRelated && showsFaces))
          )}
        />
        {!showsFaces && isScratchCanvas && pattern === "canvas" && (
          <ScratchPointSelection {...{ setup, handleInputChange }} />
        )}
        {showsFaces && (
          <MaskSelection {...{ setActiveMask, setup, handleInputChange }} />
        )}
      </nav>
    </>
  );
};

export default Menu;
