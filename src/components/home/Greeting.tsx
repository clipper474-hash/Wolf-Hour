"use client";

import { useEffect, useState } from "react";

function greetingFor(hour: number): string {
  if (hour < 5) return "Rest well";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Wind down";
}

export function Greeting({ name = "there" }: { name?: string }) {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  return (
    <p
      className="font-display text-snow/90"
      style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", letterSpacing: "-0.03em" }}
    >
      {greeting ? `${greeting}, ${name}.` : " "}
    </p>
  );
}
