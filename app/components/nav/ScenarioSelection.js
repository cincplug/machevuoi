// Scenarios.js

import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import scenarios from "../../data/scenarios.json";
import DEFAULT_SETUP from "../../_setup.json";

const ScenarioSelection = ({ setup, setSetup, handleInputChange }) => {
  const navigate = useNavigate();
  const params = useParams();

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
      const newUrl = `/${scenarioKey.replace("/", "")}`;
      navigate(newUrl);
    },
    [setSetup, handleInputChange, navigate]
  );

  useEffect(() => {
    if (params.scenario) {
      const scenarioIndex = Object.keys(scenarios).indexOf(params.scenario);
      if (scenarioIndex !== -1 && scenarioIndex !== setup.activeScenarioIndex) {
        handleScenarioButtonClick(null, params.scenario, scenarioIndex);
      }
    }
  }, [params, setup.activeScenarioIndex, handleScenarioButtonClick]);

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
