import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { VariantProps, VariantsConfig } from './types';

export function neatoVariants<T extends VariantProps>(
  config: VariantsConfig<T>
): (props?: Partial<T> & { className?: string }) => string;

export function neatoVariants<T extends Record<string, VariantProps>>(
  config: { [K in keyof T]: VariantsConfig<T[K]> }
): (props?: { [K in keyof T]?: Partial<T[K]> & { className?: string } }) => { [K in keyof T]: string };

export function neatoVariants(config: any): any {
  const isMultiSlot = !('base' in config || 'variants' in config || 'compoundVariants' in config || 'defaultVariants' in config);
  if (isMultiSlot) {
    // 각 슬롯별로 함수 반환
    const result: Record<string, (props?: any) => string> = {};
    for (const slotName of Object.keys(config)) {
      const slotConfig = config[slotName];
      result[slotName] = neatoVariants(slotConfig);
    }
    return result;
  }
  return (props: any = {}) => {
    const { base = '', variants = {}, compoundVariants = [], defaultVariants = {} } = config;
    const mergedProps = { ...defaultVariants, ...props };
    const classes: string[] = [];
    if (base) classes.push(base);
    for (const [variantName, variantOptions] of Object.entries(variants)) {
      const propValue = mergedProps[variantName];
      if (propValue !== undefined && variantOptions) {
        const className = (variantOptions as Record<string, string>)[String(propValue)];
        if (className) classes.push(className);
      }
    }
    for (const compound of compoundVariants) {
      const { className, ...conditions } = compound;
      const matches = Object.entries(conditions).every(([key, value]) => mergedProps[key] === value);
      if (matches) classes.push(className);
    }
    if (props.className) classes.push(props.className);
    return twMerge(clsx(...classes));
  };
}
