"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

type HealthResult =
  | { state: "loading" }
  | { state: "success"; status: string }
  | { state: "error"; message: string };

export default function Home() {
  const [health, setHealth] = useState<HealthResult>({ state: "loading" });

  useEffect(() => {
    api<{ status: string }>("/health")
      .then(({ status }) => setHealth({ state: "success", status }))
      .catch((error: unknown) =>
        setHealth({
          state: "error",
          message: error instanceof Error ? error.message : String(error),
        }),
      );
  }, []);

  return (
    <main>
      <h1>API health check</h1>
      <p aria-live="polite">
        {health.state === "loading" && "Checking API..."}
        {health.state === "success" && `API status: ${health.status}`}
        {health.state === "error" && `API error: ${health.message}`}
      </p>
    </main>
  );
}
