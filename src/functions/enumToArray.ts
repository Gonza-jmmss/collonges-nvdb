function enumToArray<T extends Record<string, string | number>>(
  enumParam: T,
): Array<{ key: number; value: string }> {
  return Object.entries(enumParam)
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => ({
      key: Number(key),
      value: value as string,
    }));
}

export default enumToArray;
