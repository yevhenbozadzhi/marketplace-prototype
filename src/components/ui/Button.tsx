"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "active";

export function Button({
  className,
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
        variant === "primary" && "bg-[#17130f] text-white hover:bg-[#302923]",
        variant === "secondary" && "border border-[#d8c7b4] bg-white text-[#17130f] hover:bg-[#f6eee3]",
        variant === "danger" && "bg-[#4b2118] text-white hover:bg-[#633024]",
        variant === "active" && "border border-[#276437] bg-[#ecf6ed] text-[#276437]",
        className,
      )}
      {...props}
    />
  );
}
