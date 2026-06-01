import { cn } from "@/shared/utils/cn";

export function FormCard({ title, description, children, className }) {
  return (
    <section className={cn("ui-card-elevated p-5 tablet:p-6 kiosk:p-8", className)}>
      {(title || description) && (
        <header className="mb-5 text-center tablet:mb-6">
          {title ? <h2 className="text-section text-lg tablet:text-xl">{title}</h2> : null}
          {description ? (
            <p className="mt-1.5 text-sm text-text-muted tablet:text-base">{description}</p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
