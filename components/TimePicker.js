import { useCallback, useEffect, useRef } from "react";
import ReactTimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { throttle } from "lodash";

/**
 * Given a center point and an angle, create a projection function that accepts
 * coordinates, and returns new coordinates representing an x/y position assuming
 * the provided angle is the 0 degree angle.
 * @param {number} cx
 * @param {number} cy
 * @param {number} angle
 * @returns {(x: number, y: number) => [number, number]}
 */
const createProjection = (centerX, centerY, angleRad) => (x, y) => {
  const adjustedX =
    Math.cos(angleRad) * (x - centerX) + Math.sin(angleRad) * (y - centerY);
  const adjustedY =
    -Math.sin(angleRad) * (x - centerX) + Math.cos(angleRad) * (y - centerY);
  return [adjustedX, adjustedY];
};

/**
 * @param {HTMLElement} root
 * @param {HTMLElement} element
 * @param {(degreesRotated: number) => void} onRelease
 */
const handleDrag = (root, element, onRelease, clockSegments) => {
  let projection;
  let angle;
  const drag = throttle((e) => {
    e.preventDefault();
    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!projection) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const deltaY = y - cy;
      const deltaX = x - cx;
      projection = createProjection(cx, cy, Math.atan2(deltaY, deltaX));
    }
    const [dx, dy] = projection(x, y);
    angle = Math.atan2(dy, dx) * (180 / Math.PI);

    element.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  }, 16);
  const stop = () => {
    // Reset styles
    element.style.transform = `translateX(-50%)`;
    element.style.setProperty("--grabbing", "grab");
    document.removeEventListener("pointermove", drag);
    document.removeEventListener("pointerup", stop);

    // UX: Snap to nearest segment
    let changedAngle = angle / (360 / clockSegments);
    // UX: Make fine adjustments easier by always moving at least 1 tick
    changedAngle =
      changedAngle > 0 ? Math.ceil(changedAngle) : Math.floor(changedAngle);
    // Reset state
    angle = undefined;
    projection = undefined;
    onRelease(changedAngle * (360 / clockSegments));
  };
  const onPointerDown = (e) => {
    e.preventDefault();
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
  );
}
