import { formatDate } from "../helpers/dates";
import { CopyButton } from "./Copy";
import style from "./DiscordTimestamps.module.css";

const TimestampRow = ({ unixTime, format }) => {
  const stamp = `<t:${unixTime}:${format}>`;
  return (
    <div className="flex">
      <div>
        <code className={`${style.timestamp} p-1 -my-2`}>{stamp}</code>{" "}
      </div>
      <CopyButton className="w-4 flex-shrink-0" text={stamp} />
      <div className="max-w-[5rem]">
        <span className={`${style.formattedTime}`}>
          {formatDate(unixTime, format)}
        </span>
      </div>
    </div>
  );
};

const formats = ["t", "T", "d", "D", "f", "F", "R"];
/**
 *
 * @param {Object} props
 * @param {Date} props.datetime
 * @returns
 */
const DiscordTimestamps = ({ datetime, className }) => {
  const unixTime = Number(Math.floor(datetime / 1000));
  return (
    <div className={`${className}`}>
      <p>
        Copy full date
        <CopyButton
          className="w-4 flex-shrink-0"
          text={`<t:${unixTime}:f>, <t:${unixTime}:R>`}
        />
      </p>
      <span className={`${style.formattedTime}`}>
        {" "}
        {formatDate(unixTime, "f")}, {formatDate(unixTime, "R")}
      </span>
      <div className="hr" />
      {formats.map((f) => (
        <TimestampRow key={f} unixTime={unixTime} format={f} />
      ))}
    </div>
  );
};

export default DiscordTimestamps;
