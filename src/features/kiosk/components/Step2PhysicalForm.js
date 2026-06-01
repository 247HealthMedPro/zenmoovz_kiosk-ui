"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormCard } from "@/components/ui/FormCard";
import { KioskButton } from "@/components/ui/KioskButton";
import { KioskSlider } from "@/components/ui/KioskSlider";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { IconPerson } from "@/components/ui/icons/SportIcons";
import { copy } from "@/lib/constants/kioskCopy";
import { step2PhysicalSchema } from "@/lib/validations/step2PhysicalSchema";
import { setStep2Data } from "@/api/kioskSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  AGE_MAX,
  AGE_MIN,
  GENDER_SEGMENT_OPTIONS,
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/lib/constants/kioskTheme";

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
  const age = watch("age");
  const heightCm = watch("heightCm");
  const weightKg = watch("weightKg");

  const onSubmit = (data) => {
    dispatch(setStep2Data(data));
    router.push("/kiosk/cricket/step-3");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 tablet:gap-8">
      <input type="hidden" {...register("genderCategory")} />

      <FormCard title={copy.step2GenderTitle} description={copy.step2GenderSubtitle}>
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 tablet:gap-4 kiosk:grid-cols-3 kiosk:gap-4">
          {GENDER_SEGMENT_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.value}
              icon={IconPerson}
              title={opt.title}
              hint={opt.hint}
              selected={genderCategory === opt.value}
              onClick={() =>
                setValue("genderCategory", opt.value, { shouldValidate: true })
              }
            />
          ))}
        </div>
        {errors.genderCategory ? (
          <p className="mt-4 text-center text-sm text-error">{errors.genderCategory.message}</p>
        ) : null}
      </FormCard>

      <FormCard title={copy.step2MeasurementsTitle}>
        <input type="hidden" {...register("age", { valueAsNumber: true })} />
        <input type="hidden" {...register("heightCm", { valueAsNumber: true })} />
        <input type="hidden" {...register("weightKg", { valueAsNumber: true })} />
        <div className="grid grid-cols-1 gap-4 kiosk:grid-cols-3 kiosk:gap-5">
          <KioskSlider
            id="age"
            label="Age"
            suffix="years"
            min={AGE_MIN}
            max={AGE_MAX}
            value={Number.isFinite(Number(age)) ? Number(age) : AGE_MIN}
            onChange={(v) => setValue("age", v, { shouldValidate: true })}
            onNumberChange={(v) =>
              setValue("age", Math.min(AGE_MAX, Math.max(AGE_MIN, v)), { shouldValidate: true })
            }
            error={errors.age?.message}
          />
          <KioskSlider
            id="height"
            label="Height"
            suffix="cm"
            min={HEIGHT_MIN_CM}
            max={HEIGHT_MAX_CM}
            value={Number.isFinite(Number(heightCm)) ? Number(heightCm) : HEIGHT_MIN_CM}
            onChange={(v) => setValue("heightCm", v, { shouldValidate: true })}
            onNumberChange={(v) =>
              setValue("heightCm", Math.min(HEIGHT_MAX_CM, Math.max(HEIGHT_MIN_CM, v)), {
                shouldValidate: true,
              })
            }
            error={errors.heightCm?.message}
          />
          <KioskSlider
            id="weight"
            label="Weight"
            suffix="kg"
            min={WEIGHT_MIN_KG}
            max={WEIGHT_MAX_KG}
            value={Number.isFinite(Number(weightKg)) ? Number(weightKg) : WEIGHT_MIN_KG}
            onChange={(v) => setValue("weightKg", v, { shouldValidate: true })}
            onNumberChange={(v) =>
              setValue("weightKg", Math.min(WEIGHT_MAX_KG, Math.max(WEIGHT_MIN_KG, v)), {
                shouldValidate: true,
              })
            }
            error={errors.weightKg?.message}
          />
        </div>
      </FormCard>

      <KioskButton type="submit" size="xl" className="mx-auto w-full max-w-md">
        {copy.continue}
      </KioskButton>
    </form>
  );
}
