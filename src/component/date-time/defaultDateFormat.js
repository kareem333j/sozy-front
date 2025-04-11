import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = parseISO(isoString);
  return format(date, 'd MMMM yyyy', { locale: ar });
};
