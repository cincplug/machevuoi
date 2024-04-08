import React, { useCallback, useMemo } from "react";
import DEFAULT_SCENARIOS from "../../data/scenarios.json";
import DEFAULT_SETUP from "../../_setup.json";

const ScenarioSelection = ({ setup, setSetup, handleInputChange }) => {
  const scenarios = useMemo(
    () => ({ ...DEFAULT_SCENARIOS, ...setup.customScenarios }),
    [setup.customScenarios]
  );

  const handleScenarioButtonClick = useCallback(
    (_event, scenarioKey, index) => {
      setSetup((prevSetup) => {
        const newScenario = scenarios[scenarioKey];
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

  return (
    <fieldset className="menu--scenarios">
      <legend>Scenarios</legend>
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