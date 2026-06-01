"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";
import { step2PhysicalSchema } from "@/lib/validations/step2PhysicalSchema";
import { setStep2Data } from "@/api/kioskSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  AGE_MAX,
  AGE_MIN,
  GENDER_CATEGORY,
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/lib/constants/kioskTheme";
import { cn } from "@/shared/utils/cn";

export function Step2PhysicalForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const kiosk = useAppSelector((s) => s.kiosk);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step2PhysicalSchema),
    defaultValues: {
      genderCategory: kiosk.genderCategory || "",
      age: kiosk.age || 18,
      heightCm: kiosk.heightCm || 170,
      weightKg: kiosk.weightKg || 70,
    },
  });

  const genderCategory = watch("genderCategory");

  const onSubmit = (data) => {
    dispatch(setStep2Data(data));
    router.push("/kiosk/cricket/step-3");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-w-lg flex-col gap-10">
      <input type="hidden" {...register("genderCategory")} />

      <div role="group" aria-labelledby="gender-heading" className="space-y-4">
        <h2 id="gender-heading" className="text-center text-lg font-semibold text-brand">
          Gender
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <SelectCard
            pressed={genderCategory === GENDER_CATEGORY.MALE}
            onClick={() => {
              setValue("genderCategory", GENDER_CATEGORY.MALE, { shouldValidate: true });
            }}
            label="Male"
          />
          <SelectCard
            pressed={genderCategory === GENDER_CATEGORY.FEMALE}
            onClick={() => {
              setValue("genderCategory", GENDER_CATEGORY.FEMALE, { shouldValidate: true });
            }}
            label="Female"
          />
        </div>
        {errors.genderCategory ? (
          <p className="text-center text-sm text-red-600">{errors.genderCategory.message}</p>
        ) : null}
      </div>

      <SliderBlock
        label="Age"
        suffix="years"
        name="age"
        min={AGE_MIN}
        max={AGE_MAX}
        register={register}
        watch={watch}
        setValue={setValue}
        error={errors.age?.message}
      />

      <SliderBlock
        label="Height"
        suffix="cm"
        name="heightCm"
        min={HEIGHT_MIN_CM}
        max={HEIGHT_MAX_CM}
        register={register}
        watch={watch}
        setValue={setValue}
        error={errors.heightCm?.message}
      />

      <SliderBlock
        label="Weight"
        suffix="kg"
        name="weightKg"
        min={WEIGHT_MIN_KG}
        max={WEIGHT_MAX_KG}
        register={register}
        watch={watch}
        setValue={setValue}
        error={errors.weightKg?.message}
      />

      <KioskButton type="submit" className="w-full">
        {copy.continue}
      </KioskButton>
    </form>
  );
}

function SelectCard({ pressed, onClick, label }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-24 rounded-kiosk border-2 px-4 py-6 text-xl font-semibold transition sm:min-h-28",
        pressed
          ? "border-accent bg-accent/15 text-brand shadow-kiosk-soft"
          : "border-border bg-surface-elevated text-text-muted hover:border-brand/25"
      )}
    >
      {label}
    </motion.button>
  );
}

function SliderBlock({ label, suffix, name, min, max, register, watch, setValue, error }) {
  const value = watch(name);
  const reg = register(name, { valueAsNumber: true });
  return (
    <div className="rounded-kiosk border border-border bg-surface-elevated p-5 shadow-kiosk-soft">
      <div className="mb-3 flex items-end justify-between gap-4">
        <span className="text-lg font-semibold text-brand">{label}</span>
        <label className="sr-only" htmlFor={`${name}-num`}>
          {label} numeric
        </label>
        <input
          id={`${name}-num`}
          type="number"
          min={min}
          max={max}
          {...reg}
          onChange={(e) => {
            reg.onChange(e);
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) {
              setValue(name, Math.min(max, Math.max(min, n)), { shouldValidate: true });
            }
          }}
          className="w-24 rounded-kiosk-sm border border-border bg-surface-subtle px-2 py-2 text-center text-lg font-semibold text-brand outline-none focus:border-accent"
        />
        <span className="text-text-muted">{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={Number.isFinite(Number(value)) ? Number(value) : min}
        onChange={(e) =>
          setValue(name, Number(e.target.value), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        className="h-3 w-full cursor-pointer accent-accent"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(value)}
      />
      {error ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
