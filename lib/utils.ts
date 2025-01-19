import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const formatWithYear = 'ddd YYYY MMM DD hh:mm a';
  const formatWithoutYear = 'ddd MMM DD hh:mm a';
  const day = dayjs(dateString);
  const formattedDay = day.format(
    day.isSame(dayjs(), 'year') ? formatWithoutYear : formatWithYear
  );
  return formattedDay;
}
