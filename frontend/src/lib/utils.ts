import { format } from 'date-fns';

export function formatDateTime(datetimeString: string): string {
  if (!datetimeString) {
    return '';
  }
  return format(new Date(datetimeString), 'yyyy-MM-dd HH:mm:ss');
}
