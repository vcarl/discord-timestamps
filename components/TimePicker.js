import { useCallback, useEffect, useRef } from "react";
import ReactTimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { throttle } from "lodash";

/**
 * @param {HTMLElement} root
 * @param {HTMLElement} element
 * @param {(degreesRotated: number) => void} onRelease
 */
const handleDrag = (root, element, onRelease, clockSegments) => {
  let startingAngle;
  let angle;
  const drag = throttle((e) => {
    e.preventDefault();
    const rect = root.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const deltaY = y - cy;
    const deltaX = x - cx;
    angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    if (!startingAngle) {
      startingAngle = angle;
    }
    let diff = angle - startingAngle;

    element.style.transform = `translateX(-50%) rotate(${diff}deg)`;
  }, 16);
  const stop = () => {
    element.style.transform = `translateX(-50%)`;
    element.style.setProperty("--grabbing", "grab");
    document.removeEventListener("pointermove", drag);
    document.removeEventListener("pointerup", stop);

    let changedAngle =
      (angle + 90 - (startingAngle + 90)) / (360 / clockSegments);
    changedAngle =
      changedAngle > 0 ? Math.ceil(changedAngle) : Math.floor(changedAngle);
    onRelease(changedAngle * (360 / clockSegments));
  };
  const onPointerDown = (e) => {
    drag(e);
    element.style.setProperty("--grabbing", "grabbing");
    document.addEventListener("pointermove", drag);
    document.addEventListener("pointerup", stop);
  };
  element.addEventListener("pointerdown", onPointerDown);
  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
  };
};

/**
 * @param {import('react-time-picker').TimePickerProps} props
 */
export default function TimePicker({ onChange, value, className, ...props }) {
  const valueRef = useRef(value);
  valueRef.current = value;
  /** @type {import('react-time-picker').TimePickerProps["onChange"]} */
  const innerOnChange = useCallback(
    (e) => {
      const [hours, minutes] = e.split(":");
      const date = new Date(valueRef.current);
      date.setHours(hours);
      date.setMinutes(minutes);
      onChange(date);
    },
    [onChange],
  );

  useEffect(() => {
    const clock = document.querySelector(".react-clock");
    const minuteUnsub = handleDrag(
      clock,
      document.querySelector(".react-clock__minute-hand__body"),
      (degrees) => {
        const change = (degrees / 360) * 60;
        const date = new Date(valueRef.current);
        const hours = date.getHours();
        date.setMinutes(
          date.getMinutes() + (Math.abs(change) === 60 ? 0 : change),
        );
        date.setHours(hours);
        onChange(date);
      },
      60,
    );
    const hourUnsub = handleDrag(
      clock,
      document.querySelector(".react-clock__hour-hand__body"),
      (degrees) => {
        const change = (degrees / 360) * 12;
        const date = new Date(valueRef.current);
        const days = date.getDate();
        const months = date.getMonth();
        date.setHours(date.getHours() + (Math.abs(change) === 12 ? 0 : change));
        date.setDate(days);
        date.setMonth(months);
        onChange(date);
        console.log({ date, change, degrees: degrees / 360 });
      },
      12,
    );
    return () => {
      minuteUnsub();
      hourUnsub();
    };
  });

  return (
    <div>
      <ReactTimePicker
        className={`control ${className}`}
        clearIcon={null}
        clockIcon={null}
        renderSecondHand={false}
        shouldCloseClock={() => false}
        minuteMarksWidth={0.5}
        hourHandLength={55}
        minuteHandLength={85}
        hourHandOppositeLength={0}
        minuteHandOppositeLength={0}
        isOpen={true}
        onChange={innerOnChange}
        value={value}
        {...props}
      />
    </div>
  );
}
