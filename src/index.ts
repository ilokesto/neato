import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// Basic neato function - Simple class merging with Tailwind conflict resolution
// ============================================================================

type ClassValue = clsx.ClassValue;

export function neato(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

// ============================================================================
// Advanced Variants System - Powerful conditional styling
// ============================================================================

type VariantProps = Record<string, string | number | boolean | undefined>;

type VariantConfig<T extends VariantProps> = {
  [K in keyof T]?: Record<string, string>;
};

type CompoundVariant<T extends VariantProps> = Partial<T> & {
  className: string;
};

interface VariantsConfig<T extends VariantProps> {
  base?: string;
  variants?: VariantConfig<T>;
  compoundVariants?: CompoundVariant<T>[];
  defaultVariants?: Partial<T>;
}

// Single component overload
export function neatoVariants<T extends VariantProps>(
  config: VariantsConfig<T>
): (props?: Partial<T> & { className?: string }) => string;

// Multi-slot component overload  
export function neatoVariants<T extends Record<string, VariantProps>>(
  config: { [K in keyof T]: VariantsConfig<T[K]> }
): (props?: { [K in keyof T]?: Partial<T[K]> & { className?: string } }) => { [K in keyof T]: string };

// Implementation
export function neatoVariants(config: any): any {
  const isMultiSlot = !('base' in config || 'variants' in config || 'compoundVariants' in config || 'defaultVariants' in config);
  
  if (isMultiSlot) {
    // Multi-slot mode: returns object with slot names as keys
    return (props: any = {}) => {
      const result: Record<string, string> = {};
      
      for (const slotName of Object.keys(config)) {
        const slotConfig = config[slotName];
        const slotProps = props[slotName];
        const slotVariants = neatoVariants(slotConfig);
        result[slotName] = slotVariants(slotProps);
      }
      
      return result;
    };
  }
  
  // Single component mode: returns single className string
  return (props: any = {}) => {
    const { base = '', variants = {}, compoundVariants = [], defaultVariants = {} } = config;
    const mergedProps = { ...defaultVariants, ...props };
    const classes: string[] = [];
    
    // Add base classes
    if (base) classes.push(base);
    
    // Add variant classes
    for (const [variantName, variantOptions] of Object.entries(variants)) {
      const propValue = mergedProps[variantName];
      if (propValue !== undefined && variantOptions) {
        const className = (variantOptions as Record<string, string>)[String(propValue)];
        if (className) classes.push(className);
      }
    }
    
    // Add compound variant classes
    for (const compound of compoundVariants) {
      const { className, ...conditions } = compound;
      const matches = Object.entries(conditions).every(([key, value]) => 
        mergedProps[key] === value
      );
      if (matches) classes.push(className);
    }
    
    // Add additional className
    if (props.className) classes.push(props.className);
    
    return twMerge(clsx(...classes));
  };
}

// ============================================================================
// Type Exports - For external usage
// ============================================================================

export type { ClassValue, CompoundVariant, VariantProps, VariantsConfig };

