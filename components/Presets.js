import style from "./Presets.module.css";

const presets = {
  nextMonday: "next monday",
  nextTuesday: "next tuesday",
  nextWednesday: "next wednesday",
  nextThursday: "next thursday",
  nextFriday: "next friday",
  morning: "morning",
  noon: "noon",
  evening: "evening",
  night: "night",
};

const datePresets = [
  presets.nextMonday,
  presets.nextTuesday,
  presets.nextWednesday,
  presets.nextThursday,
  presets.nextFriday,
];

/**
 * handlePresetClick takes a day of week or time, and returns an event handler that sets the current date to that day of week or time.
 * @param {string} preset
 * @param {Date} date
 * @param {(date: Date) => void} setDate
 * @returns {React.MouseEventHandler<HTMLButtonElement>}
 */
const handlePresetClick = (preset, initialDate, setDate) => (e) => {
  e.preventDefault();
  const now = new Date();
  const date = new Date(initialDate);
  // If a date-related preset was clicked on, make sure month and year are set to
  // the current month and year. This avoids a bug around the end of the month.
  if (datePresets.includes(preset)) {
    date.setMonth(now.getMonth());
    date.setFullYear(now.getFullYear());
  }
  switch (preset) {
    case presets.nextMonday:
      date.setDate(now.getDate() + ((1 - now.getDay()) % 7) + 7);
      break;
    case presets.nextTuesday:
      date.setDate(now.getDate() + ((2 - now.getDay()) % 7) + 7);
      break;
    case presets.nextWednesday:
      date.setDate(now.getDate() + ((3 - now.getDay()) % 7) + 7);
      break;
    case presets.nextThursday:
      date.setDate(now.getDate() + ((4 - now.getDay()) % 7) + 7);
      break;
    case presets.nextFriday:
      date.setDate(now.getDate() + ((5 - now.getDay()) % 7) + 7);
      break;
    case presets.morning:
      date.setHours(9);
      date.setMinutes(0);
      break;
    case presets.noon:
      date.setHours(12);
      date.setMinutes(0);
      break;
    case presets.evening:
      date.setHours(18);
      date.setMinutes(0);
      break;
    case presets.night:
      date.setHours(21);
      date.setMinutes(0);
      break;
    default:
      throw new Error(`Unknown preset: ${preset}`);
  }
  setDate(date);
};

/**
 * @param {keyof typeof presets} preset
 * @param {Date} date
 * @returns {boolean}
 */
const isActive = (preset, date) => {
  const now = new Date();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDate();
  switch (preset) {
    case presets.nextMonday:
      return day === now.getDate() + ((8 - now.getDay()) % 7) + 7;
    case presets.nextTuesday:
      return day === now.getDate() + ((9 - now.getDay()) % 7) + 7;
    case presets.nextWednesday:
      return day === now.getDate() + ((10 - now.getDay()) % 7) + 7;
    case presets.nextThursday:
      return day === now.getDate() + ((11 - now.getDay()) % 7) + 7;
    case presets.nextFriday:
      return day === now.getDate() + ((12 - now.getDay()) % 7) + 7;
    case presets.morning:
      return minutes === 0 && hours === 9;
    case presets.noon:
      return minutes === 0 && hours === 12;
    case presets.evening:
      return minutes === 0 && hours === 18;
    case presets.night:
      return minutes === 0 && hours === 21;
    default:
      throw new Error(`Unknown preset: ${preset}`);
  }
};

export const Presets = ({ className, date, setDate }) => {
  return (
    <div className={`${className}`}>
      <PresetRow>
        <div className="mr-2 mb-2 text-sm py-1">Next:</div>
        <PresetButton preset={presets.nextMonday} date={date} setDate={setDate}>
          M
        </PresetButton>
        <PresetButton
          preset={presets.nextTuesday}
          date={date}
          setDate={setDate}
        >
          Tu
        </PresetButton>
        <PresetButton
          preset={presets.nextWednesday}
          date={date}
          setDate={setDate}
        >
          W
        </PresetButton>
        <PresetButton
          preset={presets.nextThursday}
          date={date}
          setDate={setDate}
        >
          Th
        </PresetButton>
        <PresetButton preset={presets.nextFriday} date={date} setDate={setDate}>
          F
        </PresetButton>
      </PresetRow>

      <PresetRow>
        <PresetButton preset="morning" date={date} setDate={setDate}>
          9am
        </PresetButton>
        <PresetButton preset="noon" date={date} setDate={setDate}>
          noon
        </PresetButton>
        <PresetButton preset="evening" date={date} setDate={setDate}>
          6pm
        </PresetButton>
        <PresetButton preset="night" date={date} setDate={setDate}>
          9pm
        </PresetButton>
      </PresetRow>
    </div>
  );
};

const PresetRow = ({ className = "", children }) => {
  return (
    <div className={`${className} flex flex-row justify-left flex-wrap`}>
      {children}
    </div>
  );
};

const PresetButton = ({ children, className = "", preset, setDate, date }) => {
  return (
    <button
      className={`${className} ${style.button} ${
        isActive(preset, date) ? style.active : ""
      } whitespace-nowrap mr-2 mb-2 text-sm px-4 py-1`}
      onClick={handlePresetClick(preset, date, setDate)}
    >
      {children}
    </button>
  );
};
