import { useCallback, useEffect, useRef } from "react";
import ReactTimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { throttle } from "lodash";
import TimezonePicker from "./TimezonePicker";
import { getOffsetBetweenTimezones } from "../helpers/timezones";

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

function getHourHandRotation(startMinute) {
  const degreesPerMinute = 0.5;
  const minRotation = -startMinute * degreesPerMinute;
  const maxRotation = minRotation + 60 * degreesPerMinute; // Maximum range is one hour ahead

  return (degrees) => {
    const range = maxRotation - minRotation;
    return (
      ((((degrees / 12 - minRotation) % range) + range) % range) + minRotation
    );
  };
}

/**
 * @param {HTMLElement} root
 * @param {HTMLElement} element
 * @param {(degreesRotated: number) => void} onRelease
 */
const handleDrag = (
  startingMinute,
  root,
  element,
  largerHand,
  onRelease,
  clockSegments,
) => {
  let projection;
  let angle;
  const hourHand = largerHand ? getHourHandRotation(startingMinute) : undefined;
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
    if (largerHand) {
      largerHand.style.transform = `translateX(-50%) rotate(${hourHand?.(
        angle,
      )}deg)`;
    }
  }, 16);
  const stop = () => {
    // Reset styles
    if (largerHand) {
      largerHand.style.transform = `translateX(-50%)`;
    }
    element.style.transform = `translateX(-50%)`;
    element.style.setProperty("--grabbing", "grab");
    document.removeEventListener("pointermove", drag);
    document.removeEventListener("pointerup", stop);
    document.removeEventListener("pointercancel", stop);

    // UX: Snap to nearest segment
    let changedAngle = angle / (360 / clockSegments);
    // UX: Make fine adjustments easier by always moving at least 1 tick, but
    // round normally if it's a larger change
    const roundingFunc =
      Math.abs(changedAngle) > 20
        ? Math.round
        : changedAngle > 0
        ? Math.ceil
        : Math.floor;
    changedAngle = roundingFunc(changedAngle);
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
    document.addEventListener("pointercancel", stop);
  };
  element.addEventListener("pointerdown", onPointerDown);
  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
  };
};

/**
 * @param {import('react-time-picker').TimePickerProps} props
 */
export default function TimePicker({
  onChange,
  value,
  className,
  timezone,
  locale,
  onTimezoneChange,
  ...props
}) {
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
      valueRef.current.getMinutes(),
      clock,
      document.querySelector(".react-clock__minute-hand__body"),
      document.querySelector(".react-clock__hour-hand__body"),
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
      valueRef.current.getMinutes(),
      clock,
      document.querySelector(".react-clock__hour-hand__body"),
      undefined,
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
    <div className={`control relative flex flex-col ${className}`}>
      <div className="z-10 absolute top-0 left-0 pl-3 pt-2.5">
        <SkipButton
          label="-30"
          onClick={() => {
            const date = new Date(valueRef.current);
            date.setMinutes(date.getMinutes() - 30);
            onChange(date);
          }}
        >
          <Left />
        </SkipButton>
        <SkipButton
          label="+30"
          onClick={() => {
            const date = new Date(valueRef.current);
            date.setMinutes(date.getMinutes() + 30);
            onChange(date);
          }}
        >
          <Right />
        </SkipButton>
      </div>
      <ReactTimePicker
        className="px-3 pt-2.5"
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
        locale={locale}
        {...props}
      />

      <TimezonePicker value={timezone} onChange={onTimezoneChange} />
    </div>
  );
}

const SkipButton = ({ onClick, children, className = "", label, ...props }) => (
  <button
    {...props}
    className={`relative opacity-90 ${className}`}
    onClick={onClick}
  >
    {children}
    <div className="absolute top-0 right-0 text-xs flex items-center justify-center h-[100%] w-[100%]">
      {label}
    </div>
  </button>
);

// Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
const Right = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-9 h-9 px-1"
    style={{ fill: "rgba(249, 249, 249, 0.3)" }}
    viewBox="0 0 512 512"
  >
    <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
  </svg>
);

const Left = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-9 h-9 px-1"
    style={{ fill: "rgba(249, 249, 249, 0.3)" }}
    viewBox="0 0 512 512"
  >
    <path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z" />
  </svg>
);
