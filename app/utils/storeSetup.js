import CONTROLS from "../data/controls.json";
import scenarios from "../data/scenarios.json";

const storageSetupItem = "pecelSetup";
const initialSetup = {};

export const getStoredSetup = () => {
  if (typeof window !== "undefined") {
    const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
    const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
    CONTROLS.forEach((item) => {
      initialSetup[item.id] = storedSetup
        ? storedSetup[item.id]
        : Object.values(scenarios)[0][item.id] || item.value;
    });
  }
  return initialSetup;
};

export const storeSetup = (nextSetup) => {
  if (typeof window !== "undefined") {
    let omittedKeys = CONTROLS.filter(
      (item) => item.isStoringPrevented
    ).map((item) => item.id);
    let filteredNextSetup = Object.keys(nextSetup)
      .filter((key) => !omittedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = nextSetup[key];
        return obj;
      }, {});
    sessionStorage.setItem(storageSetupItem, JSON.stringify(filteredNextSetup));
  }
};
