import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function neato(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}