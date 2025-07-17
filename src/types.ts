// ============================================================================
// Type definitions for neato variants system
// ============================================================================

import type { ClassValue } from './utils';

export type VariantProps = Record<string, string | number | boolean | undefined>;

// Tailwind CSS class type for better IntelliSense
export type TailwindClass = string;

export type VariantConfig<T extends VariantProps> = {
  [K in keyof T]?: Record<string, TailwindClass>;
};

export type CompoundVariant<T extends VariantProps> = Partial<T> & {
  className: TailwindClass;
};

export interface VariantsConfig<T extends VariantProps> {
  base?: TailwindClass;
  variants?: VariantConfig<T>;
  compoundVariants?: CompoundVariant<T>[];
  defaultVariants?: Partial<T>;
}

// Re-export ClassValue for external usage
export type { ClassValue };
