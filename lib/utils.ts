import { type ClassValue, clsx } from 'clsx';
import { DEFAULT_TIME_ZONE } from 'constants/time';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { twMerge } from 'tailwind-merge';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string | Date,
  timezone?: string
): string {
  const formatWithYear = 'ddd YYYY MMM DD hh:mm a';
  const formatWithoutYear = 'ddd MMM DD hh:mm a';
  const day = dayjs(dateString).tz(timezone || DEFAULT_TIME_ZONE);
  const formattedDay = day.format(
    day.isSame(dayjs(), 'year') ? formatWithoutYear : formatWithYear
  );
  return formattedDay;
}
