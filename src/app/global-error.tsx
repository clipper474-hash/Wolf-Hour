"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    // global-error must include its own html and body tags
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#000",
          color: "#fff3f0",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#5e5e5e",
            }}
          >
            Polaris
          </p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 500, margin: "0.5rem 0 1.25rem" }}>
            Something drifted off course.
          </h1>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              border: "none",
              borderRadius: 9999,
              padding: "0.7rem 1.6rem",
              background: "#7432ff",
              color: "#fff",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
