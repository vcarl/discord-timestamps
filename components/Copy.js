import { useCallback, useState } from "react";
import style from "./Copy.module.css";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//  Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
export const CopyButton = ({ text, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = useCallback(() => {
    (async () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      await sleep(2000);
      setCopied(false);
    })();
  }, [text]);
  return (
    <button
      {...props}
      className={`${className} p-1 w-5 h-5 ml-1 mr-2`}
      onClick={handleClick}
    >
      {copied ? <Check /> : <Copy />}
    </button>
  );
};

const Copy = () => (
  <svg
    className={`${style.copyicon}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
  </svg>
);

const Check = () => (
  <svg
    className={`${style.copyicon}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
  </svg>
);
