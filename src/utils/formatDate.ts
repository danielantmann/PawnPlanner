// yyyy-mm-dd → dd/mm/yyyy (para mostrar)
export const formatDateDisplay = (date: string | null | undefined): string => {
  if (!date) return '';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
};

// yyyy-mm-dd desde números (para guardar)
export const formatDateStorage = (day: number, month: number, year: number): string => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
