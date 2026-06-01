import { cn } from "@/shared/utils/cn";

/** Full-width retail shell (categories, recommendations) */
export function AppShell({ className, children, as: Tag = "div", ...props }) {
  return (
    <Tag className={cn("app-shell flex min-h-dvh flex-col", className)} {...props}>
      {children}
    </Tag>
  );
}

/** @deprecated use AppShell or wizard-shell class */
export function KioskShell(props) {
  return <AppShell {...props} />;
}

export function FormPanel({ className, children, as: Tag = "div", ...props }) {
  return (
    <Tag className={cn("form-panel", className)} {...props}>
      {children}
    </Tag>
  );
}

/** @deprecated use FormPanel */
export function KioskFormWidth(props) {
  return <FormPanel {...props} />;
}
