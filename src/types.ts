export type VariantProps = Record<string, string | number | boolean | undefined>;
export type VariantConfig<T extends VariantProps> = {
  [K in keyof T]?: Record<string, string>;
};
export type CompoundVariant<T extends VariantProps> = Partial<T> & { className: string };
export interface VariantsConfig<T extends VariantProps> {
  base?: string;
  variants?: VariantConfig<T>;
  compoundVariants?: CompoundVariant<T>[];
  defaultVariants?: Partial<T>;
}

export type Theme = "light" | "dark" | "system";