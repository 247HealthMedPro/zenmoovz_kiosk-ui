"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingField } from "@/components/ui/FloatingField";
import { KioskButton } from "@/components/ui/KioskButton";
import { SendOtpButton, stepActionButtonClass } from "@/components/ui/SendOtpButton";
import { copy } from "@/lib/constants/kioskCopy";
import { step1ContinueSchema } from "@/lib/validations/step1UserSchema";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/api/otpApi";
import {
  otpError,
  otpSendSuccess,
  otpVerifySuccess,
  resetOtpFlow,
  invalidateOtpVerification,
} from "@/api/authSlice";
import { setStep1Data } from "@/api/kioskSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { OTP_LENGTH } from "@/lib/constants/kioskTheme";
import {
  handleMobileKeyDown,
  isValidIndianMobile,
  mobileValidationMessage,
  normalizeMobile,
  sanitizeMobileInput,
} from "@/lib/utils/mobileValidation";
import { cn } from "@/shared/utils/cn";

export function Step1UserForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const { fade } = useMotionSafe();
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [mobileTouched, setMobileTouched] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpFieldError, setOtpFieldError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step1ContinueSchema),
    defaultValues: { name: "", mobile: "" },
    mode: "onChange",
  });

  const nameValue = watch("name") ?? "";
  const mobileRaw = watch("mobile") ?? "";
  const mobileDigits = normalizeMobile(mobileRaw);

  useEffect(() => {
    if (auth.otpVerified && auth.lastMobile && mobileDigits !== auth.lastMobile) {
      dispatch(resetOtpFlow());
      setOtpValue("");
    }
  }, [auth.lastMobile, auth.otpVerified, dispatch, mobileDigits]);

  const nameValid = nameValue.trim().length >= 1;
  const mobileValid = isValidIndianMobile(mobileDigits);
  const mobileHint = mobileTouched ? mobileValidationMessage(mobileDigits) : null;

  const canSendOtp = nameValid && mobileValid && !sending && !verifying;
  const canProceed =
    auth.otpSent && otpValue.length === OTP_LENGTH && !verifying && !sending;

  const saveAndGoToProfile = (data) => {
    dispatch(
      setStep1Data({
        name: data.name.trim(),
        mobile: normalizeMobile(data.mobile),
      })
    );
    router.push("/kiosk/cricket/step-2");
  };

  const validateDetailsForOtp = async () => {
    const ok = await trigger(["name", "mobile"]);
    return ok && nameValid && mobileValid;
  };

  const onSendOtp = async () => {
    clearErrors();
    dispatch(otpError(null));
    setOtpFieldError(null);

    const ok = await validateDetailsForOtp();
    if (!ok) {
      if (!nameValid) setError("name", { message: "Name is required" });
      if (!mobileValid) {
        setError("mobile", {
          message:
            mobileValidationMessage(mobileDigits) || "Enter a valid 10-digit mobile number",
        });
      }
      return;
    }

    try {
      await sendOtp({ mobile: mobileDigits }).unwrap();
      dispatch(otpSendSuccess(mobileDigits));
      setOtpValue("");
    } catch (e) {
      dispatch(otpError(e?.data?.message ?? "Could not send OTP"));
    }
  };

  const onVerifyAndContinue = handleSubmit(async (data) => {
    setOtpFieldError(null);
    dispatch(otpError(null));

    if (!auth.otpSent) return;

    if (auth.otpVerified) {
      saveAndGoToProfile(data);
      return;
    }

    if (otpValue.length !== OTP_LENGTH) {
      setOtpFieldError(`Enter ${OTP_LENGTH}-digit OTP`);
      return;
    }

    try {
      const res = await verifyOtp({ mobile: mobileDigits, otp: otpValue }).unwrap();
      dispatch(otpVerifySuccess(res.sessionId));
      saveAndGoToProfile(data);
    } catch (e) {
      dispatch(otpError(e?.data?.message ?? "Verification failed"));
    }
  });

  return (
    <form onSubmit={onVerifyAndContinue} className="w-full">
      <section className="ui-card-elevated overflow-hidden px-4 py-4 tablet:px-5 tablet:py-5">
        <div className="space-y-3">
          <FloatingField
            id="name"
            label="Full name"
            error={errors.name?.message}
            autoComplete="name"
            inputMode="text"
            inputClassName="min-h-[3.25rem] pt-6 text-base"
            {...register("name")}
          />
          <FloatingField
            id="mobile"
            label="Mobile number"
            error={errors.mobile?.message || mobileHint}
            success={mobileValid && !errors.mobile && !mobileHint ? true : undefined}
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            inputClassName="min-h-[3.25rem] pt-6 text-base"
            {...register("mobile", {
              onChange: (e) => {
                const sanitized = sanitizeMobileInput(e.target.value);
                if (e.target.value !== sanitized) {
                  e.target.value = sanitized;
                  setValue("mobile", sanitized, { shouldValidate: true, shouldDirty: true });
                }
                setMobileTouched(true);
                if (auth.otpSent || auth.otpVerified) {
                  dispatch(resetOtpFlow());
                  setOtpValue("");
                }
              },
              onKeyDown: handleMobileKeyDown,
              onPaste: (e) => {
                e.preventDefault();
                const pasted = sanitizeMobileInput(e.clipboardData.getData("text"));
                setValue("mobile", pasted, { shouldValidate: true, shouldDirty: true });
                setMobileTouched(true);
                if (auth.otpSent || auth.otpVerified) {
                  dispatch(resetOtpFlow());
                  setOtpValue("");
                }
              },
              onBlur: () => setMobileTouched(true),
            })}
          />
        </div>

        <SendOtpButton
          sent={auth.otpSent}
          loading={sending}
          disabled={!canSendOtp}
          onClick={onSendOtp}
        />

        <AnimatePresence>
          {auth.otpSent ? (
            <motion.div
              key="otp-flow"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={fade}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-border/80 pt-4">
                <p role="status" className="mb-3 text-center text-xs text-text-muted">
                  {copy.otpSentSuccess}
                </p>
                <OtpSection
                  value={otpValue}
                  onChange={(v) => {
                    setOtpValue(v);
                    setOtpFieldError(null);
                    if (auth.otpVerified) dispatch(invalidateOtpVerification());
                  }}
                  error={otpFieldError}
                />
                <div className="mt-4 flex justify-center">
                  <KioskButton
                    type="submit"
                    variant="primary"
                    size="md"
                    className={stepActionButtonClass}
                    disabled={!canProceed}
                    loading={verifying}
                  >
                    {copy.verifyAndContinue}
                  </KioskButton>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {auth.errorMessage ? (
            <motion.p
              key={auth.errorMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 rounded-lg border border-error/20 bg-red-50/80 px-3 py-2 text-center text-xs text-error"
              role="alert"
            >
              {auth.errorMessage}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </section>
    </form>
  );
}

function OtpSection({ value, onChange, error }) {
  const refs = useRef([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  const setDigit = (index, char) => {
    const next = value.split("");
    while (next.length < OTP_LENGTH) next.push("");
    next[index] = char.replace(/\D/g, "").slice(-1) || "";
    onChange(next.join("").slice(0, OTP_LENGTH));
  };

  return (
    <div>
      <p id="otp-label" className="mb-2 text-center text-xs font-medium text-text-muted">
        Enter {OTP_LENGTH}-digit OTP
      </p>
      <div
        role="group"
        aria-labelledby="otp-label"
        className="flex justify-center gap-2"
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
            value={d.trim() === "" ? "" : d}
            onChange={(e) => {
              const c = e.target.value.replace(/\D/g, "");
              setDigit(i, c);
              if (c && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i]?.trim() && i > 0) {
                refs.current[i - 1]?.focus();
              }
            }}
            className={cn(
              "h-11 w-9 rounded-lg border border-border bg-surface-elevated text-center text-lg font-bold text-brand outline-none focus:border-accent/50"
            )}
          />
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-center text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
