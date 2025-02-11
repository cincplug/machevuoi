import React, { useCallback } from "react";
import CONTROLS from "../../data/controls.json";
import { ISetup, UpdateSetupType } from "../../../types";

interface PatternEntry {
  key: string;
  pattern: ISetup;
  index: number;
}

interface IProps {
  setup: ISetup;
  setSetup: React.Dispatch<React.SetStateAction<ISetup>>;
  updateSetup: (event: UpdateSetupType) => void;
  patterns: {
    [key: string]: ISetup;
  };
  title: string;
}

const PatternSelection: React.FC<IProps> = ({
  setup,
  setSetup,
  updateSetup,
  patterns,
  title
}) => {
  const handlePatternButtonClick = useCallback(
    (
      _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      patternKey: string,
      index: number
    ) => {
      setSetup((prevSetup) => {
        const newPattern = patterns?.[patternKey];
        if (!newPattern) {
          const initialSetup: ISetup = { selectedNotes: [] };
          CONTROLS.forEach((item) => {
            initialSetup[item.id] = item.value;
          });
          return initialSetup;
        }
        return { ...prevSetup, ...newPattern };
      });
      updateSetup({
        id: "activePatternIndex",
        value: index,
        type: "range"
      });
    },
    [patterns, setSetup, updateSetup]
  );

  if (!patterns) return null;

  const patternEntries = Object.entries(patterns).map(
    ([key, pattern], index): PatternEntry => ({
      key,
      pattern,
      index
    })
  );

  const svgPatterns = patternEntries.filter(
    ({ pattern }) => pattern.output === "svg"
  );

  const pinchPatterns = patternEntries.filter(
    ({ pattern }) => pattern.output === "canvas" && !pattern.isScratchCanvas
  );

  const scratchPatterns = patternEntries.filter(
    ({ pattern }) => pattern.output === "canvas" && pattern.isScratchCanvas
  );

  const renderPatternGroup = (patterns: PatternEntry[], title: string) => {
    if (patterns.length === 0) return null;

    return (
      <fieldset className="patterns">
        <legend>{title}</legend>
        {patterns.map(({ key, pattern, index }) => (
          <button
            className={`icon-button ${
              index === setup.activePatternIndex ? "active" : "inactive"
            }`}
            key={`scn-${index}`}
            onClick={(event) => handlePatternButtonClick(event, key, index)}
            data-icon={pattern?.icon}
          ></button>
        ))}
      </fieldset>
    );
  };

  return (
    <>
      {renderPatternGroup(svgPatterns, "SVG patterns")}
      {renderPatternGroup(pinchPatterns, "Pinch Canvas patterns")}
      {renderPatternGroup(scratchPatterns, "Scratch Canvas patterns")}
    </>
  );
};

export default PatternSelection;
