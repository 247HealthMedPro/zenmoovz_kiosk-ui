"use client";

import StoreProvider from "./StoreProvider";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import { KioskKeyboardEnhancer } from "@/features/kiosk/components/KioskKeyboardEnhancer";

export function KioskProviders({ children }) {
  return (
    <StoreProvider>
      <ServiceWorkerRegister />
      <KioskKeyboardEnhancer />
      {children}
    </StoreProvider>
  );
}
