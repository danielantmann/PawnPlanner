export const normalizeOptional = (value?: string | null) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value.trim();
};
