import React, { useCallback } from "react";
import CONTROLS from "../../data/controls.json";
import { ISetup, UpdateSetupType } from "../../../types";
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
        const newPattern =
          patterns && patternKey in patterns ? patterns[patternKey] : null;
        if (!newPattern) {
          const initialSetup: ISetup = {};
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

  if (!patterns) {
    return null;
  }

  return (
    <fieldset className="patterns">
      <legend>{title}</legend>
      {Object.keys(patterns).map((patternKey, index) => {
        const pattern = patterns[patternKey];
        return (
          <button
            className={`icon-button ${
              index === setup.activePatternIndex ? "active" : "inactive"
            }`}
            title={pattern?.description}
            key={`scn-${index}`}
            onClick={(event) =>
              handlePatternButtonClick(event, patternKey, index)
            }
          >
            {index + 1}
          </button>
        );
      })}
    </fieldset>
  );
};

export default PatternSelection;
