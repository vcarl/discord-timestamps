import { useMemo, useState, useEffect } from "react";

const TimezonePicker = ({ value, onChange }) => {
  const [tzs, setTzs] = useState([
    { tz: "America/New_York", zone: -5, offset: "UTC-05:00" },
  ]);
  useEffect(() => {
    (async () => {
      const tzData = await fetch("/api/tzs").then((res) => res.json());
      const now = new Date();
      setTzs(
        Object.values(tzData)
          .sort((a, b) => b.zone - a.zone)
          .filter((tz) => {
            // Omit timezones that are not supported by the browser
            try {
              now.toLocaleString("en-US", { timeZone: tz.tz });
            } catch (e) {
              return false;
            }
            return tz.tz;
          }),
      );
    })();
  }, []);

  return (
    <div className="mx-3 my-2.5">
      <select
        className="control p-1 text-sm max-w-[12rem] bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {tzs.map((tz) => (
          <option key={tz.tz} value={tz.tz}>
            {tz.tz} ({tz.zone})
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimezonePicker;
