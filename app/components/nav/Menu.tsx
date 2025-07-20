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
  controls: typeof import("../../data/controls.json");
  patterns: typeof import("../../data/patterns.json");
}

const Menu: React.FC<IProps> = ({
  setup,
  isStarted,
  setSetup,
  updateSetup,
  clearPaths,
  controls,
  patterns
}) => {
  const { output, isScratchCanvas } = setup;
  return (
    <section className="controls">
      <aside className={`menu primary`}>
        <Controls
          {...{ setup, updateSetup }}
          controls={controls.filter(
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
            patterns: patterns as unknown as IPatterns,
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
        <div className="reset-grid"></div>
        <Controls
          {...{ setup, updateSetup }}
          controls={controls.filter(
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
          controls={controls.filter(
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
