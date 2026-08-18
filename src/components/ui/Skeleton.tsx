"use client";

import clsx from "clsx";

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-md bg-[#e9e1d6]", className)} />;
}

export function ListingCardSkeleton() {
  return (
    <article className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <SkeletonBlock className="h-6 w-20" />
            <SkeletonBlock className="h-6 w-24" />
          </div>
          <SkeletonBlock className="h-7 w-72 max-w-full" />
        </div>
        <SkeletonBlock className="h-8 w-16" />
      </div>
      <SkeletonBlock className="mt-4 h-16 w-full" />
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SkeletonBlock className="h-12" />
        <SkeletonBlock className="h-12" />
        <SkeletonBlock className="h-12" />
        <SkeletonBlock className="h-12" />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <SkeletonBlock className="h-10 w-28" />
        <SkeletonBlock className="h-10 w-20" />
      </div>
    </article>
  );
}

export function ListingGridSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ListingCardSkeleton />
      <ListingCardSkeleton />
      <ListingCardSkeleton />
      <ListingCardSkeleton />
    </div>
  );
}

export function ManagerTableSkeleton() {
  return (
    <div className="rounded-md border border-[#ded6cc] bg-white shadow-sm">
      <div className="grid gap-0">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="grid grid-cols-[2fr_1fr_1fr_1fr_2fr] gap-6 border-t border-[#eee5da] p-4 first:border-t-0">
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-8" />
            <SkeletonBlock className="h-8" />
            <SkeletonBlock className="h-8" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-10 w-20" />
              <SkeletonBlock className="h-10 w-24" />
              <SkeletonBlock className="h-10 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <section className="flex h-[620px] max-h-[calc(100vh-260px)] min-h-[460px] flex-col rounded-md border border-[#ded6cc] bg-white shadow-sm">
      <div className="shrink-0 border-b border-[#ded6cc] p-4">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="mt-2 h-6 w-56" />
      </div>
      <div className="min-h-0 flex-1 space-y-3 p-4">
        <SkeletonBlock className="h-12 w-2/3" />
        <SkeletonBlock className="ml-auto h-12 w-1/2" />
        <SkeletonBlock className="h-16 w-3/4" />
      </div>
      <div className="shrink-0 flex gap-2 border-t border-[#ded6cc] p-4">
        <SkeletonBlock className="h-11 flex-1" />
        <SkeletonBlock className="h-11 w-24" />
      </div>
    </section>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="mt-3 h-8 w-64" />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-32 md:col-span-2" />
      </div>
    </div>
  );
}
