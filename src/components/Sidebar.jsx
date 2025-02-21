"use client";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`w-64 bg-gray-800 text-white h-screen p-4 ${open ? "block" : "hidden"}`}>
      <button className="mb-4 text-sm" onClick={() => setOpen(!open)}>Toggle Sidebar</button>
      <ul className="space-y-2">
        <li><Link href="/documentation/abstract">Abstract</Link></li>
        <li><Link href="/documentation/the-problem">The Problem</Link></li>
        <li><Link href="/documentation/roadmap">Roadmap</Link></li>
        <li><Link href="/documentation/solution">Solution</Link></li>
      </ul>
    </aside>
  );
}
