"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { MiniPlayer } from "@/components/audio/MiniPlayer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:pl-0">{children}</main>
      </div>
      <AudioPlayer />
      <MiniPlayer />
    </div>
  );
}
