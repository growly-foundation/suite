/**
 * Creates a deep partial type from a type T
 * This allows partial theme configurations to be passed in without requiring every property
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
