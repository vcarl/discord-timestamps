import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Script from "next/script";

import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import DiscordTimestamps from "../components/DiscordTimestamps";
import ForceClient from "../components/ForceClient";
import { Presets } from "../components/Presets";
import TimestampGuide, { FAQS } from "../components/TimestampGuide";
import { getOffsetBetweenTimezones } from "../helpers/timezones";
import { GA_ID, initAnalytics } from "../helpers/analytics";

const now = new Date();
now.setMinutes(0);
now.setSeconds(0);

const NavItem = ({ children, className }) => {
  return <li className={`${className} px-2 py-1`}>{children}</li>;
};
const NavList = ({ children, className = "", title }) => {
  return (
    <>
      <p className={`nav-heading ${className} px-2 py-1`}>{title}</p>
      <ul>{children}</ul>
    </>
  );
};

const SITE_URL = "https://www.discordtimestamps.com/";
const TITLE = "Discord Timestamp Generator – Convert Time to <t:> Codes";
const DESCRIPTION =
  "Free Discord timestamp generator. Pick a date, time and time zone, then copy a <t:> code that shows in every reader's local time, including relative time.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Discord Timestamp Generator",
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: {
        "@type": "Person",
        name: "Carl Vitullo",
        url: "https://bsky.app/profile/vcarl.bsky.social",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function Home() {
  const [datetime, setDate] = useState(now);
  // Run once on mount. Without the empty dependency array this re-sent a
  // page_view on every re-render (e.g. each date/time change).
  useEffect(() => {
    initAnalytics();
  }, []);

  const [{ locale, timeZone: tz }, setTz] = useState({
    locale: "en-US",
    timeZone: "",
  });
  useEffect(() => {
    const dateTimeFormat = new Intl.DateTimeFormat(navigator.language);
    const { locale, timeZone } = dateTimeFormat.resolvedOptions();
    setTz({ locale, timeZone });
  }, []);

  const calcaulatedDatetime = useMemo(() => {
    if (!tz) return datetime;
    const finalDate = new Date(datetime);

    const dateTimeFormat = new Intl.DateTimeFormat(navigator.language);
    const { timeZone: localTz } = dateTimeFormat.resolvedOptions();
    const offset = getOffsetBetweenTimezones(localTz, tz);
    finalDate.setMinutes(finalDate.getMinutes() + 60 * offset);
    return finalDate;
  }, [datetime, tz]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />
        <meta name="theme-color" content="#2b2d31" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Discord Timestamps" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      ></Script>

      <div className="grid md:grid-rows-layout md:grid-cols-layout">
        <nav className={`md:col-start-2 py-[3.75rem] pl-5 pr-3`}>
          <NavList title="A Reactiflux Project">
            <NavItem className="active">Timestamp Generator</NavItem>
          </NavList>
          <NavList title="Presets">
            <Presets className="mb-4" date={datetime} setDate={setDate} />
          </NavList>
        </nav>
        <main className="py-16 pl-10 pr-5 overflow-hidden">
          <h1 className="page-title">Discord Timestamp Generator</h1>
          <p className="mb-6">
            Pick a date, time and time zone, then click a format to copy its
            Discord timestamp code. Paste it into any message and everyone sees
            the time in their own time zone.
          </p>
          <ForceClient
            fallback={
              <p className="pb-6">Loading the timestamp generator…</p>
            }
          >
            <div className="flex -ml-2 pb-6 md:flex-row flex-col">
              <DatePicker
                locale={locale}
                className="basis-1/2 grow-1 md:mx-2 md:my-0 mx-auto my-2"
                value={datetime}
                onChange={setDate}
              />
              <TimePicker
                locale={locale}
                className="grow-0 md:mx-2 md:my-0 mx-auto my-2"
                value={datetime}
                onChange={setDate}
                timezone={tz}
                onTimezoneChange={(tz) =>
                  setTz((old) => ({ ...old, timeZone: tz }))
                }
              />
            </div>
            <DiscordTimestamps datetime={calcaulatedDatetime} />
          </ForceClient>
          <TimestampGuide />
        </main>
        <div className="bg-fill md:block hidden" />
        <footer className="md:col-span-2 md:col-start-2 py-24 px-5">
          <p>
            Created by{" "}
            <a href="https://www.linkedin.com/in/carl-vitullo-a7488728/">
              Carl Vitullo
            </a>{" "}
            <a href="https://bsky.app/profile/vcarl.bsky.social">(vcarl)</a> |{" "}
            <a href="https://github.com/vcarl/discord-timestamps">GitHub</a> |{" "}
            <a href="https://github.com/vcarl/discord-timestamps/issues/new">
              Report a bug
            </a>
          </p>
          <p>
            Need help with a community?{" "}
            <a href="https://calendly.com/vcarl/">Book some time</a>
          </p>
          <p>
            Are you a React/JS dev?{" "}
            <a href="https://www.reactiflux.com">Join Reactiflux</a>
          </p>
        </footer>
      </div>
    </>
  );
}
