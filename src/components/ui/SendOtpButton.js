import { cn } from "@/shared/utils/cn";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";

/** Matches Verify & continue — shared width + primary brand style */
export const stepActionButtonClass =
  "w-auto min-w-[11rem] max-w-[14rem] px-6";

export function SendOtpButton({ sent = false, loading = false, disabled = false, onClick, className }) {
  return (
    <div className={cn("mt-3 flex justify-center", className)}>
      <KioskButton
        type="button"
        variant="primary"
        size="md"
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        className={stepActionButtonClass}
      >
        {sent ? copy.resendOtp : copy.sendOtp}
      </KioskButton>
    </div>
  );
}
