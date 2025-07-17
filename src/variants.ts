// ============================================================================
// Advanced Variants System - Powerful conditional styling
// ============================================================================

import type { VariantProps, VariantsConfig } from './types';
import { mergeClasses, resolveTailwindConflicts } from './utils';

/**
 * Creates a variant function for conditional styling with Tailwind CSS classes.
 * 
 * @example
 * ```typescript
 * const button = neatoVariants({
 *   base: "px-4 py-2 rounded-md font-medium",
 *   variants: {
 *     variant: {
 *       primary: "bg-blue-500 text-white",
 *       secondary: "bg-gray-200 text-gray-900"
 *     }
 *   }
 * });
 * ```
 */
// Single component overload
export function neatoVariants<T extends VariantProps>(
  config: VariantsConfig<T>
): (props?: Partial<T> & { className?: string }) => string;

/**
 * Creates variant functions for multi-slot components with Tailwind CSS classes.
 */
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
    
    return resolveTailwindConflicts(mergeClasses(...classes));
  };
}
