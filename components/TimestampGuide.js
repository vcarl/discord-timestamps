// Static, server-rendered explainer content. This is what search engines index,
// since the interactive generator only renders on the client.

export const FORMAT_REFERENCE = [
  { code: "t", name: "Short time", example: "4:20 PM" },
  { code: "T", name: "Long time", example: "4:20:30 PM" },
  { code: "d", name: "Short date", example: "10/02/2026" },
  { code: "D", name: "Long date", example: "October 2, 2026" },
  {
    code: "f",
    name: "Short date & time (default)",
    example: "October 2, 2026 4:20 PM",
  },
  {
    code: "F",
    name: "Long date & time",
    example: "Friday, October 2, 2026 4:20 PM",
  },
  {
    code: "S",
    name: "Short date & time with seconds",
    example: "10/02/26, 4:20:30 PM",
  },
  { code: "R", name: "Relative time", example: "in 2 hours / 3 days ago" },
];

export const FAQS = [
  {
    q: "What is a Discord timestamp?",
    a: "A Discord timestamp is a special message tag like <t:1790958030:F> that Discord renders as a date and time in each reader's own time zone. Everyone in a server sees the same moment, converted to their local time automatically.",
  },
  {
    q: "How do I use a Discord timestamp?",
    a: "Pick a date, time and time zone above, click any format to copy its code, then paste it into a Discord message. Discord replaces the code with the formatted time when the message is sent.",
  },
  {
    q: "What do the letters in a Discord timestamp mean?",
    a: "The letter after the second colon picks the display style: t and T for times, d and D for dates, f and F for date and time together, S for a short date and time with seconds, and R for a relative time like \"in 3 hours\". Leaving the letter off uses the default f style.",
  },
  {
    q: "What is the number in a Discord timestamp?",
    a: "It's a Unix timestamp: the number of seconds since January 1, 1970 UTC. This generator calculates it for you from the date, time and time zone you choose.",
  },
  {
    q: "Do Discord timestamps work in every time zone?",
    a: "Yes. That's their main purpose. Each person sees the time in the time zone set on their own device, so you never have to convert event times by hand.",
  },
  {
    q: "Do Discord timestamps work in embeds, bots and nicknames?",
    a: "They work in regular messages, embed descriptions and fields, and bot messages. They do not render in usernames, nicknames, channel names or embed titles.",
  },
];

const Code = ({ children }) => (
  <code className="rounded bg-black/30 px-1 py-0.5 text-[0.85em] text-white">
    {children}
  </code>
);

const TimestampGuide = () => (
  <section aria-labelledby="guide-heading" className="guide mt-12">
    <div className="hr" />
    <h2 id="guide-heading" className="guide-h2">
      How to use Discord timestamps
    </h2>
    <p>
      Discord timestamps let you share a date or time that automatically shows
      up in every reader&apos;s local time zone, which makes them ideal for
      event announcements, raid times, stream schedules and deadlines. Choose a
      date and time with the generator above, then copy the code for the
      format you want and paste it into any Discord message. The syntax is{" "}
      <Code>&lt;t:UNIX_TIMESTAMP:STYLE&gt;</Code>.
    </p>

    <h2 className="guide-h2">Discord timestamp formats</h2>
    <div className="overflow-x-auto">
      <table className="guide-table">
        <thead>
          <tr>
            <th scope="col">Style</th>
            <th scope="col">Name</th>
            <th scope="col">Example output</th>
          </tr>
        </thead>
        <tbody>
          {FORMAT_REFERENCE.map(({ code, name, example }) => (
            <tr key={code}>
              <td>
                <Code>{`<t:1790958030:${code}>`}</Code>
              </td>
              <td>{name}</td>
              <td>{example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h2 className="guide-h2">Frequently asked questions</h2>
    {FAQS.map(({ q, a }) => (
      <div key={q} className="mb-4">
        <h3 className="guide-h3">{q}</h3>
        <p>{a}</p>
      </div>
    ))}
  </section>
);

export default TimestampGuide;
