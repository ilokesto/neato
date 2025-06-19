import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type NeatoInputs = clsx.ClassValue[];

export function neato(...inputs: NeatoInputs) {
  return twMerge(
    clsx(...inputs)
  );
}