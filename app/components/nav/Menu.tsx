import CONTROLS from "../../data/controls.json";
import DEFAULT_SCENARIOS from "../../data/scenarios.json";
import Controls from "./Controls";
import Buttons from "./Buttons";
import Scenarios from "./Scenarios";
import ShapeSelection from "./ShapeSelection";
import Info from "../nav/Info";
import { ISetup, UpdateSetupType } from "../../../types";

interface IProps {
  setup: ISetup;
  isStarted: boolean;
  setSetup: React.Dispatch<React.SetStateAction<ISetup>>;
  updateSetup: (event: UpdateSetupType) => void;
  clearPaths: () => void;
}

const Menu: React.FC<IProps> = ({
  setup,
  isStarted,
  setSetup,
  updateSetup,
  clearPaths
}) => {
  const { pattern, isScratchCanvas } = setup;
  return (
    <section className="controls">
      <aside className={`menu menu--primary`}>
        <Controls
          {...{ setup, updateSetup }}
          controls={CONTROLS.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentPattern ||
                control.parentPattern.includes(pattern)) &&
              !control.isHandRelated
          )}
        />
        <Buttons {...{ setup, updateSetup, clearPaths }} />
        <Scenarios
          {...{
            setup,
            setSetup,
            updateSetup,
            scenarios: DEFAULT_SCENARIOS,
            title: "Scenarios"
          }}
        />
        <Scenarios
          {...{
            setup,
            setSetup,
            updateSetup,
            scenarios: setup.customScenarios,
            title: "Custom scenarios"
          }}
        />
      </aside>
      <aside className={`menu menu--secondary`}>
        <Controls
          {...{ setup, updateSetup }}
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
          <ShapeSelection {...{ setup, updateSetup }} />
        )}
      </aside>
      {isStarted && <Info {...{ setup }} />}
    </section>
  );
};

export default Menu;
