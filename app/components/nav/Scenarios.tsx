import React, { useCallback } from "react";
import CONTROLS from "../../data/controls.json";
import { ISetup, ChangeEventType } from "../../../types";

interface IProps {
  setup: ISetup;
  setSetup: React.Dispatch<React.SetStateAction<ISetup>>;
  handleInputChange: (event: ChangeEventType) => void;
  scenarios: {
    [key: string]: ISetup;
  };
  title: string;
}

const ScenarioSelection: React.FC<IProps> = ({
  setup,
  setSetup,
  handleInputChange,
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
      handleInputChange({
        target: {
          id: "activeScenarioIndex",
          value: index,
          type: "range"
        }
      });
    },
    [scenarios, setSetup, handleInputChange]
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
            className={`menu--scenarios__button ${
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
