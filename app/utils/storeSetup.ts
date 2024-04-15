import CONTROLS from "../data/controls.json";
import scenarios from "../data/scenarios.json";

interface ControlItem {
  id: string;
  title: string;
  description: string;
  isOmittedInScenario?: boolean;
  value: string | number | boolean | object | null;
  type: string;
  options?: string[];
  isHandRelated?: boolean;
  min?: number;
  max?: number;
  step?: number;
  parentPattern?: string | string[];
  isHidden?: boolean;
  isStoringPrevented?: boolean;
}

interface Setup {
  [key: string]: string | number | boolean | object | null;
}

const storageSetupItem = "pecelSetup";
const initialSetup: Setup = {};

export const getStoredSetup = (): Setup => {
  if (typeof window !== "undefined") {
    const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
    const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
    CONTROLS.forEach((item: ControlItem) => {
      initialSetup[item.id] = storedSetup
      ? storedSetup[item.id]
      : (Object.values(scenarios)[0] as {[key: string]: any})[item.id] || item.value;    
    });
  }
  return initialSetup;
};

export const storeSetup = (nextSetup: Setup): void => {
  if (typeof window !== "undefined") {
    let omittedKeys = CONTROLS.filter(
      (item: ControlItem) => item.isStoringPrevented
    ).map((item: ControlItem) => item.id);
    let filteredNextSetup: Setup = Object.keys(nextSetup)
      .filter((key: string) => !omittedKeys.includes(key))
      .reduce((obj: Setup, key: string) => {
        obj[key] = nextSetup[key];
        return obj;
      }, {});
    sessionStorage.setItem(storageSetupItem, JSON.stringify(filteredNextSetup));
  }
};
