import Timestamp from "./Timestamp";

/**
 * Copyable link back to the current time. Client-only (reads window), so
 * render it inside <ForceClient>.
 * @param {{ query: string }} props query string from buildShareQuery
 */
const ShareLink = ({ query }) => {
  const url = `${window.location.origin}/${query}`;
  return (
    <>
      <div className="hr" />
      <p>Share this time</p>
      <p className="text-sm mb-1 opacity-75">
        Anyone who opens the link sees this exact moment.
      </p>
      <Timestamp
        text={url}
        format="link"
        className="flex items-start text-left max-w-full"
      >
        <span className="whitespace-normal break-all">{url}</span>
      </Timestamp>
    </>
  );
};

export default ShareLink;
