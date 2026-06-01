"use client";

import StoreProvider from "./StoreProvider";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";

export function KioskProviders({ children }) {
  return (
    <StoreProvider>
      <ServiceWorkerRegister />
      {children}
    </StoreProvider>
  );
}
