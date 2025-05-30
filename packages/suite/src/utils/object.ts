/**
 * Deep merges two objects
 * Used for merging theme overrides with base themes
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof typeof source;
      const targetKey = key as keyof T;

      if (isObject(source[sourceKey])) {
        if (!(key in target)) {
          output[targetKey] = source[sourceKey] as any;
        } else {
          output[targetKey] = deepMerge(target[targetKey], source[sourceKey] as any);
        }
      } else {
        output[targetKey] = source[sourceKey] as any;
      }
    });
  }

  return output;
}

/**
 * Checks if a value is an object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
