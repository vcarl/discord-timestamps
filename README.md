# Discord Timestamp Generator

**[discordtimestamps.com](https://www.discordtimestamps.com/)** is a free tool for creating Discord timestamps: message codes like `<t:1790958030:F>` that Discord shows in each reader's own time zone.

Pick a date, time and time zone, click a format, and paste the copied code into any Discord message. Use it for event announcements, raid times, stream schedules, deadlines, or anything else where people in different time zones need to agree on a time.

## Discord timestamp formats

The syntax is `<t:UNIX_TIMESTAMP:STYLE>`, where the timestamp is in seconds since January 1, 1970 UTC.

| Code                 | Style                          | Example output                   |
| -------------------- | ------------------------------ | -------------------------------- |
| `<t:1790958030:t>`   | Short time                     | 4:20 PM                          |
| `<t:1790958030:T>`   | Long time                      | 4:20:30 PM                       |
| `<t:1790958030:d>`   | Short date                     | 10/02/2026                       |
| `<t:1790958030:D>`   | Long date                      | October 2, 2026                  |
| `<t:1790958030:f>`   | Short date & time (default)    | October 2, 2026 4:20 PM          |
| `<t:1790958030:F>`   | Long date & time               | Friday, October 2, 2026 4:20 PM  |
| `<t:1790958030:S>`   | Short date & time with seconds | 10/02/26, 4:20:30 PM             |
| `<t:1790958030:R>`   | Relative time                  | in 2 hours / 3 days ago          |

Example output is shown in US English for 4:20:30 PM UTC; Discord formats each timestamp for the reader's own locale and time zone.

## Features

- Date and time pickers with time zone selection
- One-click copy for every Discord timestamp style
- Presets for common times (morning, noon, evening, night) and "next Monday"–"next Friday"
- Live preview of how each format will look

## Development

Built with [Next.js](https://nextjs.org/) and Tailwind CSS.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Contributing

Bug reports and pull requests are welcome. [Open an issue](https://github.com/vcarl/discord-timestamps/issues/new) if something looks wrong.

Created by [Carl Vitullo](https://bsky.app/profile/vcarl.bsky.social), a [Reactiflux](https://www.reactiflux.com) project.

## License

[MIT](LICENSE)
