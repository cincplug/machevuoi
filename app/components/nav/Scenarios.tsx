import React, { useCallback } from "react";
import CONTROLS from "../../data/controls.json";
import { Noto_Emoji } from "next/font/google";
import { ISetup, UpdateSetupType } from "../../../types";

const notoEmoji = Noto_Emoji({ subsets: ["emoji"] });

interface IProps {
  setup: ISetup;
  setSetup: React.Dispatch<React.SetStateAction<ISetup>>;
  updateSetup: (event: UpdateSetupType) => void;
  scenarios: {
    [key: string]: ISetup;
  };
  title: string;
}

const ScenarioSelection: React.FC<IProps> = ({
  setup,
  setSetup,
  updateSetup,
  scenarios,
  title
}) => {
  const handleScenarioButtonClick = useCallback(
    (
      _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      scenarioKey: string,
      index: number
    ) => {
      setSetup((prevSetup) => {
        const newScenario =
          scenarios && scenarioKey in scenarios ? scenarios[scenarioKey] : null;
        if (!newScenario) {
          const initialSetup: ISetup = {};
          CONTROLS.forEach((item) => {
            initialSetup[item.id] = item.value;
          });
          return initialSetup;
        }
        return { ...prevSetup, ...newScenario };
      });
      updateSetup({
        id: "activeScenarioIndex",
        value: index,
        type: "range"
      });
    },
    [scenarios, setSetup, updateSetup]
  );

  if (!scenarios) {
    return null;
  }

  return (
    <fieldset className="menu--scenarios">
      <legend>{title}</legend>
      {Object.keys(scenarios).map((scenarioKey, index) => {
        const scenario = scenarios[scenarioKey];
        return (
          <button
            className={`menu--scenarios__button ${notoEmoji.className} ${
              index === setup.activeScenarioIndex ? "active" : "inactive"
            }`}
            title={scenario?.description}
            key={`scn-${index}`}
            onClick={(event) =>
              handleScenarioButtonClick(event, scenarioKey, index)
            }
          >
            {scenario?.icon || scenarioKey}
          </button>
        );
      })}
    </fieldset>
  );
};

export default ScenarioSelection;
