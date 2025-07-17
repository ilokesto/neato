// ============================================================================
// neato - A powerful utility library for efficient CSS class management
// ============================================================================

import { mergeClasses, resolveTailwindConflicts, type ClassValue } from './utils';
import { neatoVariants } from './variants';

// ============================================================================
// Basic neato function - Simple class merging with Tailwind conflict resolution
// ============================================================================

export function neato(...inputs: ClassValue[]) {
  return resolveTailwindConflicts(mergeClasses(...inputs));
}

// ============================================================================
// Exports
// ============================================================================

export type {
  ClassValue, CompoundVariant, VariantProps,
  VariantsConfig
} from './types';
export { neatoVariants };

