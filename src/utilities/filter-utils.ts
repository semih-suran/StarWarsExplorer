export const matchesSearch = (
  target: string | undefined,
  query: string | undefined
): boolean => {
  if (!query) return true;
  return (target || "").toLowerCase().includes(query.trim().toLowerCase());
};

export const matchesExact = (
  target: string | undefined,
  query: string | undefined
): boolean => {
  if (!query) return true;
  return (target || "").toLowerCase() === query.trim().toLowerCase();
};
