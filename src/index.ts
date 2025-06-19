import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type NeatoInput = clsx.ClassValue;

export function neato(...inputs: Array<NeatoInput>) {
  return twMerge(
    clsx(...inputs)
  );
}