import { toZonedTime, format } from "date-fns-tz";

const FRANCE_TIMEZONE = "Europe/Paris";

export function newFrenchDate(date: Date) {
  const utcDate = date ? new Date(date) : new Date();
  return toZonedTime(utcDate, FRANCE_TIMEZONE);
}

export function formatFrenchDate(
  date = new Date(),
  pattern = "yyyy-MM-dd HH:mm:ss",
) {
  const zonedDate = toZonedTime(date, FRANCE_TIMEZONE);
  return format(zonedDate, pattern, { timeZone: FRANCE_TIMEZONE });
}
