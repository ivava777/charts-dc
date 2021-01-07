export const enumToArray = (val: unknown): string[] =>
  Object.keys(val).map((type) => val[type]);
