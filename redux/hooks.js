import { useDispatch, useSelector } from "react-redux";

/** @typedef {ReturnType<import('./store').makeStore>} AppStore */
/** @typedef {ReturnType<AppStore['getState']>} RootState */
/** @typedef {AppStore['dispatch']} AppDispatch */

/** @returns {AppDispatch} */
export function useAppDispatch() {
  return useDispatch();
}

/** @template T @param {(state: RootState) => T} selector @returns {T} */
export function useAppSelector(selector) {
  return useSelector(selector);
}
