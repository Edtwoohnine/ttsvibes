import type { ReactNode } from "react";

export function Layout({
  sidebar,
  main,
}: {
  sidebar: ReactNode;
  main: ReactNode;
}) {
  return (
    <div className="app">
      <header className="header">
        <h1>TTSVibes</h1>
        <span className="tagline">Voice cloning & text-to-speech</span>
      </header>
      <div className="content">
        <aside className="sidebar">{sidebar}</aside>
        <main className="main">{main}</main>
      </div>
    </div>
  );
}
