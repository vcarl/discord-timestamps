export const getOffsetBetweenTimezones = (timezone1, timezone2) => {
  const date1 = new Date().toLocaleString("en-US", { timeZone: timezone1 });
  const date2 = new Date().toLocaleString("en-US", { timeZone: timezone2 });
  return (new Date(date1).getTime() - new Date(date2).getTime()) / 3600000;
};
