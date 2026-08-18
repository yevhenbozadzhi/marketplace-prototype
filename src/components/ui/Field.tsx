"use client";

import clsx from "clsx";
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClass = "mt-2 w-full rounded-md border border-[#d8c7b4] bg-white px-3 text-sm outline-none focus:border-[#17130f]";

export function TextInput({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const input = <input className={clsx("h-10", controlClass, className)} {...props} />;
  if (!label) return input;
  return (
    <label className="text-sm font-semibold">
      {label}
      {input}
    </label>
  );
}

export function SelectInput({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const select = (
    <select className={clsx("h-10", controlClass, className)} {...props}>
      {children}
    </select>
  );
  if (!label) return select;
  return (
    <label className="text-sm font-semibold">
      {label}
      {select}
    </label>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const textarea = <textarea className={clsx("min-h-32 p-3", controlClass, className)} {...props} />;
  if (!label) return textarea;
  return (
    <label className="text-sm font-semibold">
      {label}
      {textarea}
    </label>
  );
}
