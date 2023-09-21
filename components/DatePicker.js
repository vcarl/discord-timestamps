import { useCallback, useRef } from "react";
import ReactCalendar from "react-calendar";

/**
 * @param {import('react-date-picker').DatePickerProps} props
 */
export default function DatePicker({ value, onChange, className, ...props }) {
  const valueRef = useRef(value);
  valueRef.current = value;
  const timeRef = useRef();
  timeRef.current = `${value.getHours()}:${value.getMinutes()}`;

  /** @type {import('react-date-picker').DatePickerProps["onChange"]} */
  const innerOnChange = useCallback(
    (e) => {
      const [hours, minutes] = timeRef.current.split(":");
      e.setHours(hours);
      e.setMinutes(minutes);
      onChange(e);
    },
    [onChange],
  );
  return (
    <ReactCalendar
      className={`control ${className}`}
      closeCalendar={false}
      shouldCloseCalendar={() => false}
      isOpen={true}
      minDetail="decade"
      clearIcon={null}
      value={valueRef.current}
      onChange={innerOnChange}
      {...props}
    />
  );
}
