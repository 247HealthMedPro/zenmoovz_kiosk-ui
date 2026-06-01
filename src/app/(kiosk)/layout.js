import { KioskProviders } from "@/components/providers/KioskProviders";

export default function KioskGroupLayout({ children }) {
  return (
    <KioskProviders>
      <div className="min-h-dvh bg-surface pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        {children}
      </div>
    </KioskProviders>
  );
}
