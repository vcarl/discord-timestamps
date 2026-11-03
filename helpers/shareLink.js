// Shareable links: /?t=<unix seconds>&tz=<IANA time zone>
// `t` is the exact moment; `tz` only controls which time zone the pickers
// show it in, so the sender's wall-clock time is preserved for the recipient.

const MAX_UNIX_SECONDS = 8.64e12 / 1000; // Largest instant a JS Date can hold

const isValidTimeZone = (tz) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @param {string} search window.location.search
 * @returns {{ t: number, tz: string | null } | null}
 */
export const parseShareParams = (search) => {
  const params = new URLSearchParams(search);
  const rawT = params.get("t");
  if (!rawT || !/^-?\d{1,13}$/.test(rawT)) return null;
  const t = Number(rawT);
  if (Math.abs(t) > MAX_UNIX_SECONDS) return null;

  const rawTz = params.get("tz");
  const tz = rawTz && isValidTimeZone(rawTz) ? rawTz : null;
  return { t, tz };
};

/**
 * Build the query string for a shareable link. Slashes in zone names are left
 * readable (tz=America/New_York); "+" is escaped so Etc/GMT+5 survives parsing.
 * @param {number} unixTime
 * @param {string} [tz]
 */
export const buildShareQuery = (unixTime, tz) => {
  let query = `?t=${unixTime}`;
  if (tz) query += `&tz=${tz.replace(/\+/g, "%2B")}`;
  return query;
};
