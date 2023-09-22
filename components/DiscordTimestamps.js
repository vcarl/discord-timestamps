import { formatDate } from "../helpers/dates";
import Timestamp from "./Timestamp";

const TimestampRow = ({ unixTime, format }) => {
  const stamp = `<t:${unixTime}:${format}>`;
  return (
    <div className="flex mb-1">
      <Timestamp showCode text={stamp} className="flex">
        {formatDate(unixTime, format)}
      </Timestamp>
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
      <div>
        <p>Copy full date</p>
        <Timestamp
          text={`<t:${unixTime}:d> <t:${unixTime}:t>, <t:${unixTime}:R>`}
        >
          {formatDate(unixTime, "d")} {formatDate(unixTime, "t")},{" "}
          {formatDate(unixTime, "R")}
        </Timestamp>
        <Timestamp text={`<t:${unixTime}:f>, <t:${unixTime}:R>`}>
          {formatDate(unixTime, "f")}, {formatDate(unixTime, "R")}
        </Timestamp>
      </div>
      <div className="hr" />
      {formats.map((f) => (
        <TimestampRow key={f} unixTime={unixTime} format={f} />
      ))}
    </div>
  );
};

export default DiscordTimestamps;
