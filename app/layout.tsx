import type { Metadata } from "next";
import "@fontsource-variable/fraunces/index.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Campus Grounds — the campus cafe counter, in code",
  description:
    "A campus cafe order counter rebuilt as a system: a priority queue for tickets, breadth-first search for the nearest free table, and Dijkstra's algorithm for department delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grain min-h-screen font-body antialiased">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
