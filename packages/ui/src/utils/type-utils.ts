export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

type Entries<T> = NonNullable<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
>[];

export const typedEntries = <T extends object>(
  obj: T,
  orderBy?: readonly (keyof T)[]
): Entries<T> => {
  if (orderBy) {
    return orderBy
      .filter((k) => obj[k] !== undefined)
      .map((k) => [k, obj[k]]) as Entries<T>;
  }
  return Object.entries(obj) as Entries<T>;
};
