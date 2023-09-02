"use client";

import { useState } from "react";
import Head from "next/head";

import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import DiscordTimestamps from "../components/DiscordTimestamps";
import ForceClient from "../components/ForceClient";

const now = new Date();
now.setMinutes(0);
now.setSeconds(0);

export default function Home() {
  const [datetime, setDate] = useState(now);
  return (
    <>
      <Head>
        <title>Discord Timestamps</title>
        <meta
          name="description"
          content="A simple app for generating relative timestamps in Discord"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex">
        <nav></nav>
        <main className="content min-h-screen py-16 pl-10">
          <ForceClient>
            <div className="flex -ml-2 pb-6">
              <DatePicker
                className="mx-2"
                value={datetime}
                onChange={(e) => setDate(e)}
              />
              <TimePicker
                className="mx-2"
                value={datetime}
                onChange={(e) => setDate(e)}
              />
            </div>
            <DiscordTimestamps datetime={datetime} />
          </ForceClient>
        </main>
      </div>

      <footer className=""></footer>
    </>
  );
}
