import DEFAULT_SETUP from "../_setup.json";
import scenarios from "../data/scenarios.json";

const storageSetupItem = "pecelSetup";
const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
const initialSetup = {};

export const getStoredSetup = () => {
  DEFAULT_SETUP.forEach((item) => {
    initialSetup[item.id] = storedSetup
      ? storedSetup[item.id]
      : Object.values(scenarios)[0][item.id] || item.value;
  });
  return initialSetup;
};

export const storeSetup = (nextSetup) => {
  let omittedKeys = DEFAULT_SETUP.filter((item) => item.isStoringPrevented).map(
    (item) => item.id
  );
  let filteredNextSetup = Object.keys(nextSetup)
    .filter((key) => !omittedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = nextSetup[key];
      return obj;
    }, {});
  sessionStorage.setItem(storageSetupItem, JSON.stringify(filteredNextSetup));
};
