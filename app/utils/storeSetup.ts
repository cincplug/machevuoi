import CONTROLS from "../data/controls.json";
import patterns from "../data/patterns.json";
import { ISetup } from "../../types";

interface IControlItem {
  id: string;
  title: string;
  description: string;
  isOmittedInPattern?: boolean;
  value: string | number | boolean | object | null;
  type: string;
  options?: string[];
  isHandRelated?: boolean;
  min?: number;
  max?: number;
  step?: number;
  parentOutput?: string | string[];
  isHidden?: boolean;
  isStoringPrevented?: boolean;
}

const storageSetupItem = "machevuoiSetup";

export const getStoredSetup = (): ISetup => {
  const initialSetup: ISetup = {};
  if (typeof window !== "undefined") {
    const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
    const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
    CONTROLS.forEach((item: IControlItem) => {
      initialSetup[item.id] = storedSetup
        ? storedSetup[item.id]
        : (Object.values(patterns)[0] as { [key: string]: any })[item.id] ||
          item.value;
    });
  }
  return initialSetup;
};

export const storeSetup = (nextSetup: ISetup): void => {
  if (typeof window !== "undefined") {
    let omittedKeys = CONTROLS.filter(
      (item: IControlItem) => item.isStoringPrevented
    ).map((item: IControlItem) => item.id);
    let filteredNextSetup: ISetup = Object.keys(nextSetup)
      .filter((key: string) => !omittedKeys.includes(key))
      .reduce((obj: ISetup, key: string) => {
        obj[key] = nextSetup[key];
        return obj;
      }, {});
    sessionStorage.setItem(storageSetupItem, JSON.stringify(filteredNextSetup));
  }
};
