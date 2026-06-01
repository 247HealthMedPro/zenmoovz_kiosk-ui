import { Skeleton } from "@/components/ui/Skeleton";

export default function CricketLoading() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-8 px-4 py-12 sm:px-8">
      <Skeleton className="mx-auto h-10 w-2/3 max-w-md" />
      <Skeleton className="h-14 w-full rounded-kiosk" />
      <Skeleton className="h-40 w-full rounded-kiosk" />
      <Skeleton className="h-40 w-full rounded-kiosk" />
      <Skeleton className="h-14 w-full rounded-kiosk" />
    </div>
  );
}
