const HOUR = 3600000;

/**
 * Hours between the wall clocks of two time zones at a given instant.
 * The instant matters: offsets change with daylight saving time.
 */
export const getOffsetBetweenTimezones = (timezone1, timezone2, at = new Date()) => {
  const date1 = at.toLocaleString("en-US", { timeZone: timezone1 });
  const date2 = at.toLocaleString("en-US", { timeZone: timezone2 });
  return (new Date(date1).getTime() - new Date(date2).getTime()) / HOUR;
};

/**
 * The pickers hold a Date whose *local* wall-clock reading is the time the
 * user chose in `timeZone`. Return the real instant that reading means.
 * The offset is measured at the target instant (refined once), so dates on
 * the other side of a DST change from today come out right.
 */
export const wallTimeToInstant = (wallTime, localTz, timeZone) => {
  let instant = new Date(wallTime);
  for (let i = 0; i < 2; i++) {
    const offset = getOffsetBetweenTimezones(localTz, timeZone, instant);
    instant = new Date(wallTime.getTime() + offset * HOUR);
  }
  return instant;
};

/** Inverse of wallTimeToInstant: the picker Date that shows `instant` in `timeZone`. */
export const instantToWallTime = (instant, localTz, timeZone) =>
  new Date(
    instant.getTime() -
      getOffsetBetweenTimezones(localTz, timeZone, instant) * HOUR,
  );
