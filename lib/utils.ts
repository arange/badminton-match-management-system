import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const formatWithYear = 'ddd YYYY MMM DD HH:mm';
  const formatWithoutYear = 'ddd MMM DD HH:mm';
  const day = dayjs(dateString);
  const formattedDay = day.format(
    day.isSame(dayjs(), 'year') ? formatWithoutYear : formatWithYear
  );
  return formattedDay;
}
