import CONTROLS from "../../data/controls.json";
import DEFAULT_SCENARIOS from "../../data/scenarios.json";
import Controls from "./Controls";
import Buttons from "./Buttons";
import Scenarios from "./Scenarios";
import ShapeSelection from "./ShapeSelection";
import { ISetup, ChangeEventType } from "../../../types";

interface IProps {
  setup: ISetup;
  setSetup: React.Dispatch<React.SetStateAction<ISetup>>;
  handleInputChange: (event: ChangeEventType) => void;
  clearPaths: () => void;
}

const Menu: React.FC<IProps> = ({
  setup,
  setSetup,
  handleInputChange,
  clearPaths
}) => {
  const { pattern, isScratchCanvas } = setup;
  return (
    <section className="controls">
      <aside className={`menu menu--primary`}>
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
      </aside>
      <aside className={`menu menu--secondary`}>
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
      </aside>
    </section>
  );
};

export default Menu;
