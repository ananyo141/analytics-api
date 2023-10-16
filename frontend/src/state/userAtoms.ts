import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const ACCESS_STORAGE_KEY = "analytics_accesstoken";
const REMEMBER_STORAGE_KEY = "analytics_remember";

export const rememberMeAtom = atomWithStorage(REMEMBER_STORAGE_KEY, false);

export const tokenAtom = atom(
  (typeof window !== "undefined" &&
    window.localStorage.getItem(ACCESS_STORAGE_KEY)) ||
    (typeof window !== "undefined" &&
      window.sessionStorage.getItem(ACCESS_STORAGE_KEY)) ||
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
  }
);

export const isAuthAtom = atom((get) => get(tokenAtom) !== "");

export const clearStorage = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_STORAGE_KEY);
  window.localStorage.removeItem(REMEMBER_STORAGE_KEY);
  window.sessionStorage.removeItem(ACCESS_STORAGE_KEY);
};
