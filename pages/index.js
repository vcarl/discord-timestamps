"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import DiscordTimestamps from "../components/DiscordTimestamps";
import ForceClient from "../components/ForceClient";
import { Presets } from "../components/Presets";

const now = new Date();
now.setMinutes(0);
now.setSeconds(0);

const NavItem = ({ children, className }) => {
  return <li className={`${className} px-2 py-1`}>{children}</li>;
};

const Nav = ({ className }) => {
  return (
    <nav className={`${className} py-[3.75rem] pl-5 pr-3`}>
      <h1 className="px-2 py-1">A Reactiflux Project</h1>
      <ul>
        <NavItem className="active">Timestamp Generator</NavItem>
      </ul>
    </nav>
  );
};

export default function Home() {
  const [datetime, setDate] = useState(now);
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-3BBW7XEREH");
  });

  return (
    <>
      <Head>
        <title>Discord Timestamps</title>
        <meta
          name="description"
          content="A simple app for generating relative timestamps in Discord. A Reactiflux project by vcarl."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-3BBW7XEREH"
      ></Script>

      <div className="grid md:grid-rows-layout md:grid-cols-layout">
        <Nav className="md:col-start-2" />
        <main className="py-16 pl-10 pr-5 overflow-hidden">
          <Presets className="mb-4" date={datetime} setDate={setDate} />
          <ForceClient>
            <div className="flex -ml-2 pb-6 md:flex-row flex-col">
              <DatePicker
                className="md:mx-2 md:my-0 mx-auto my-2"
                value={datetime}
                onChange={setDate}
              />
              <TimePicker
                className="md:mx-2 md:my-0 mx-auto my-2"
                value={datetime}
                onChange={setDate}
              />
            </div>
            <DiscordTimestamps datetime={datetime} />
          </ForceClient>
        </main>
        <div className="bg-fill md:block hidden" />
        <footer className="md:col-span-2 md:col-start-2 py-24 px-5">
          <p>
            Created by{" "}
            <a href="https://www.linkedin.com/in/carl-vitullo-a7488728/">
              Carl Vitullo
            </a>{" "}
            <a href="https://bsky.app/profile/vcarl.bsky.social">(vcarl)</a> |{" "}
            <a href="https://github.com/vcarl/discord-timestamps">
              Project GitHub
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
