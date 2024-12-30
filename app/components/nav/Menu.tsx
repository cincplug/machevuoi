import CONTROLS from "../../data/controls.json";
import DEFAULT_PATTERNS from "../../data/patterns.json";
import Controls from "./Controls";
import Buttons from "./Buttons";
import PatternSelection from "./PatternSelection";
import ShapeSelection from "./ShapeSelection";
import Info from "../nav/Info";
import { ISetup, IPatterns } from "../../../types";
import PianoKeyboard from "./PianoKeyboard";

export type UpdateSetupType =
  | {
      type: "SET_SELECTED_NOTES";
      payload: string[];
    }
  | {
      type: string;
    };

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
  const { output, isScratchCanvas } = setup;
  return (
    <section className="controls">
      <aside className={`menu primary`}>
        <Controls
          {...{ setup, updateSetup }}
          controls={CONTROLS.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentOutput ||
                control.parentOutput.includes(output)) &&
              !control.isHandRelated
          )}
        />
        <Buttons {...{ setup, updateSetup, clearPaths }} />
        <PatternSelection
          {...{
            setup,
            setSetup,
            updateSetup,
            patterns: DEFAULT_PATTERNS as unknown as IPatterns,
            title: "Patterns"
          }}
        />
        <PatternSelection
          {...{
            setup,
            setSetup,
            updateSetup,
            patterns: setup.customPatterns,
            title: "Custom patterns"
          }}
        />
        <Controls
          {...{ setup, updateSetup }}
          controls={CONTROLS.filter(
            (control) => !control.isHidden && control.isSoundRelated
          )}
        />
        {setup.hasSound && (
          <PianoKeyboard
            {...{ setup, updateSetup }}
            selectedNotes={setup.selectedNotes || []}
            onNotesChange={(notes) =>
              updateSetup({ type: "SET_SELECTED_NOTES", payload: notes })
            }
          />
        )}
      </aside>
      <aside className={`menu secondary`}>
        <Controls
          {...{ setup, updateSetup }}
          controls={CONTROLS.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentOutput ||
                control.parentOutput.includes(output)) &&
              control.isHandRelated &&
              !control.isSoundRelated &&
              (isScratchCanvas || !control.isScratchCanvasRelated)
          )}
        />
        {isScratchCanvas && output === "canvas" && (
          <ShapeSelection {...{ setup, updateSetup }} />
        )}
      </aside>
      {isStarted && <Info {...{ setup }} />}
    </section>
  );
};

export default Menu;
