"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import NextRaceCard from "../components/NextRaceCard";
import Calendar from "../components/Calendar";

// Utility: decode base64url safely
function decodeJWT(token: string) {
  try {
    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(json);
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [nextRace, setNextRace] = useState<any>(null);

  useEffect(() => {
    // 🔥 Always read from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage.");
      return;
    }

    // ----- Decode JWT -----
    const payload = decodeJWT(token);
    if (payload?.sub) {
      setUser({ display_name: payload.sub });
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const loadData = async () => {
      try {
        // 1. Fetch series list
        const seriesList = await fetch("http://127.0.0.1:8000/series", {
          headers,
        }).then((r) => r.json());

        const allEvents: any[] = [];

        // 2. Fetch each series schedule
        for (const series of seriesList) {
          const seasonId = series.season_id;

          try {
            const schedule = await fetch(
              `http://127.0.0.1:8000/series/${seasonId}/schedule`,
              { headers }
            ).then((r) => r.json());

            const mapped = schedule.map((race: any) => ({
              title:
                race.series_name ||
                race.event_name ||
                "Race",
              start: race.start_date,
              raw: race,
            }));

            allEvents.push(...mapped);
          } catch (err) {
            console.error(`Schedule load failed for season ${seasonId}`, err);
          }
        }

        // 3. Load special events
        const special = await fetch("http://127.0.0.1:8000/events/special", {
          headers,
        }).then((r) => r.json());

        const mappedSpecial = special.map((ev: any) => ({
          title: ev.event_name || "Special Event",
          start: ev.start_date,
          raw: ev,
        }));

        allEvents.push(...mappedSpecial);

        // 4. Sort events
        allEvents.sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        setEvents(allEvents);

        // 5. Determine next upcoming race
        const now = new Date();
        const upcoming = allEvents.find(
          (e) => new Date(e.start) > now
        );

        setNextRace(upcoming || null);
      } catch (err) {
        console.error("Failed loading events:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10 flex flex-col gap-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome{user ? `, ${user.display_name}` : ""}
          </h1>
          <p className="text-gray-600">
            Here's your upcoming iRacing schedule.
          </p>
        </div>

        {/* Next race card */}
        <NextRaceCard race={nextRace} />

        {/* Calendar */}
        <Calendar events={events} />
      </main>
    </div>
  );
}
