import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const ACCESS_STORAGE_KEY = "analytics_accesstoken";
const REMEMBER_STORAGE_KEY = "analytics_remember";

export const rememberMeAtom = atomWithStorage(REMEMBER_STORAGE_KEY, false);


export const tokenAtom = atom(
  localStorage.getItem(ACCESS_STORAGE_KEY) ||
    sessionStorage.getItem(ACCESS_STORAGE_KEY) ||
    "",
  (get, set, update) => {
    const storage = get(rememberMeAtom) ? localStorage : sessionStorage;
    if (update instanceof Function) {
      const newValue = update(get(tokenAtom));
      storage.setItem(ACCESS_STORAGE_KEY, newValue);
      set(tokenAtom, newValue);
    } else {
      storage.setItem(ACCESS_STORAGE_KEY, update as any);
      set(tokenAtom, update);
    }
    set(tokenAtom, "");
  }
);

export const isAuthAtom = atom((get) => get(tokenAtom) !== "");

export const clearStorage = () => {
  localStorage.removeItem(ACCESS_STORAGE_KEY);
  sessionStorage.removeItem(ACCESS_STORAGE_KEY);
};
