import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page does not exist.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--lux-black)",
        color: "var(--ivory)",
        fontFamily: "system-ui, sans-serif",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#C8A45D",
        }}
      >
        404
      </p>
      <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400 }}>
        This page does not exist.
      </h1>
      <p style={{ color: "#9ca3af", maxWidth: "380px", lineHeight: 1.7 }}>
        You may have followed an old link. The page you&apos;re looking for has
        moved or no longer exists.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "0.5rem",
          padding: "0.75rem 2rem",
          border: "1px solid #C8A45D",
          color: "#C8A45D",
          textDecoration: "none",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
