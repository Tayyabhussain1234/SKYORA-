/**
 * Utility functions for timezone-aware date and time formatting
 */

export function getLocalCurrentTime(timezone: string): {
  dayName: string;
  fullDate: string;
  timeString: string;
} {
  try {
    const now = new Date();
    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: timezone,
    });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: timezone,
    });
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    });

    return {
      dayName: dayFormatter.format(now),
      fullDate: dateFormatter.format(now),
      timeString: timeFormatter.format(now),
    };
  } catch {
    // Fallback if timezone string is invalid
    const now = new Date();
    return {
      dayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeString: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  }
}

export function formatHourString(isoString: string): string {
  // ISO string is typically 'YYYY-MM-DDTHH:mm'
  try {
    const parts = isoString.split('T')[1];
    if (!parts) return isoString;
    const [h] = parts.split(':');
    const hourNum = parseInt(h, 10);
    if (isNaN(hourNum)) return isoString;
    if (hourNum === 0) return '12 AM';
    if (hourNum === 12) return '12 PM';
    if (hourNum > 12) return `${hourNum - 12} PM`;
    return `${hourNum} AM`;
  } catch {
    return isoString;
  }
}

export function formatDayLabel(isoDateString: string, index: number): { dayName: string; fullDate: string } {
  if (index === 0) {
    const date = new Date(isoDateString + 'T12:00:00');
    const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dayName: 'Today', fullDate };
  }
  try {
    const date = new Date(isoDateString + 'T12:00:00');
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dayName, fullDate };
  } catch {
    return { dayName: isoDateString, fullDate: '' };
  }
}

export function formatTimeFromIso(isoString: string): string {
  try {
    const parts = isoString.split('T')[1];
    if (!parts) return isoString;
    const [h, m] = parts.split(':');
    let hourNum = parseInt(h, 10);
    const minuteNum = m ? m.slice(0, 2) : '00';
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    if (hourNum === 0) hourNum = 12;
    else if (hourNum > 12) hourNum -= 12;
    return `${hourNum}:${minuteNum} ${ampm}`;
  } catch {
    return isoString;
  }
}
