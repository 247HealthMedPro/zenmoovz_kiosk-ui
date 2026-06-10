import { KioskProviders } from "@/components/providers/KioskProviders";

export default function KioskGroupLayout({ children }) {
  return (
    <KioskProviders>
      <div className="min-h-dvh bg-surface pb-[max(env(safe-area-inset-bottom),env(keyboard-inset-height,0px))] pt-[env(safe-area-inset-top)] selection:bg-brand-soft selection:text-brand">
        {children}
      </div>
    </KioskProviders>
  );
}
