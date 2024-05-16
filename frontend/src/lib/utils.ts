import { format } from 'date-fns';

export function formatDateTime(datetimeString: string): string {
  if (!datetimeString) {
    return '';
  }
  return format(new Date(datetimeString), 'yyyy-MM-dd HH:mm:ss');
}

export function hexToBase64(hex: string): string {
  const raw = atob(hex.replace(/[ \r\n]+$/, ''));
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    result += String.fromCharCode(raw.charCodeAt(i));
  }
  return btoa(result);
}
