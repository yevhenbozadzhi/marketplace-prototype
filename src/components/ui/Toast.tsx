"use client";

import clsx from "clsx";

export type ToastMessage = {
  id: string;
  tone: "success" | "warning" | "error" | "info";
  message: string;
};

export function ToastViewport({ toasts }: { toasts: ToastMessage[] }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-50 grid w-[min(360px,calc(100vw-32px))] gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "rounded-md border px-4 py-3 text-sm font-semibold shadow-lg",
            toast.tone === "success" && "border-[#9fc8a8] bg-[#ecf6ed] text-[#276437]",
            toast.tone === "warning" && "border-[#ead1a9] bg-[#fff1d8] text-[#8f5f28]",
            toast.tone === "error" && "border-[#d8aaa0] bg-[#fff0ed] text-[#7f2f22]",
            toast.tone === "info" && "border-[#cfc6bb] bg-white text-[#17130f]",
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
