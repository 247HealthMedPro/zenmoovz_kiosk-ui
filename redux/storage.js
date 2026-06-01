import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem(_key) {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem(_key) {
    return Promise.resolve();
  },
});

// sessionStorage: per-tab kiosk flow survives refresh, clears when tab closes
const storage =
  typeof window !== "undefined"
    ? createWebStorage("session")
    : createNoopStorage();

export default storage;
