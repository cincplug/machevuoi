import React, { useCallback } from "react";
import DEFAULT_SETUP from "../../_setup.json";

const ScenarioSelection = ({
  setup,
  setSetup,
  handleInputChange,
  scenarios,
  title
}) => {
  const handleScenarioButtonClick = useCallback(
    (_event, scenarioKey, index) => {
      setSetup((prevSetup) => {
        const newScenario = scenarios ? scenarios[scenarioKey] : null;
        if (!newScenario) {
          const initialSetup = {};
          DEFAULT_SETUP.forEach((item) => {
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
