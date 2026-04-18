function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  year: 365,
};

export function resolveDateRange(
  period?: string,
  startDay?: string,
  endDay?: string
): { startDay: string; endDay: string } {
  if (period && PERIOD_DAYS[period] !== undefined) {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - PERIOD_DAYS[period]);
    return { startDay: formatDate(start), endDay: formatDate(now) };
  }

  if (startDay && endDay) {
    return { startDay, endDay };
  }

  if (startDay || endDay) {
    throw new Error("Both startDay and endDay are required");
  }

  throw new Error("Provide either a period preset or startDay/endDay");
}
