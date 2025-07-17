
import { mergeClasses, resolveTailwindConflicts, type ClassValue } from './utils';
import { neatoVariants } from './variants';

export function neato(...inputs: ClassValue[]) {
  return resolveTailwindConflicts(mergeClasses(...inputs));
}

export type { CompoundVariant, VariantProps, VariantsConfig } from './types';
export { neatoVariants };

