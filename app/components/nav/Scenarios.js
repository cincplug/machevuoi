import React, { useCallback, useMemo } from "react";
import DEFAULT_SCENARIOS from "../../data/scenarios.json";
import DEFAULT_SETUP from "../../_setup.json";

const ScenarioSelection = ({ setup, setSetup, handleInputChange }) => {
  const scenarioEntries = useMemo(() => {
    const customScenarioKeys = Object.keys(setup.customScenarios);
    const defaultScenarioKeys = Object.keys(DEFAULT_SCENARIOS);
    const allScenarioKeys = [...defaultScenarioKeys, ...customScenarioKeys];
    return allScenarioKeys.map((scenarioKey) => ({
      key: scenarioKey,
      data: setup.customScenarios[scenarioKey] || DEFAULT_SCENARIOS[scenarioKey],
    }));
  }, [setup.customScenarios]);

  const handleScenarioButtonClick = useCallback(
    (_event, scenarioKey, index) => {
      setSetup((prevSetup) => {
        const newScenario = scenarioEntries.find((entry) => entry.key === scenarioKey)?.data;
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
    [scenarioEntries, setSetup, handleInputChange]
  );

  return (
    <fieldset className="menu--scenarios">
      <legend>Scenarios</legend>
      {scenarioEntries.map(({ key, data }, index) => (
        <button
          className={`menu--scenarios__button ${
            index === setup.activeScenarioIndex ? "active" : "inactive"
          }`}
          title={data?.description}
          key={`scn-${index}`}
          onClick={(event) =>
            handleScenarioButtonClick(event, key, index)
          }
        >
          {data?.icon || key}
        </button>
      ))}
    </fieldset>
  );
};

export default ScenarioSelection;
