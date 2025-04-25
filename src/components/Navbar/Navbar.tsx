"use client";

import Link from "next/link";
import Image from "next/image";
import pokelogo from "@/assets/navbar/pokelogo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={pokelogo}
            alt="Pokédex Logo"
            width={96}
            height={32}
            className="h-auto w-24 invert filter"
            priority
          />
          <span className="text-xl font-semibold tracking-tight text-zinc-800">
            Binpar Pokédex
          </span>
        </Link>

        <nav className="hidden items-center text-sm text-zinc-600 sm:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 transition hover:bg-zinc-100"
          >
            Inicio
          </Link>
          <Link
            href="https://github.com/sergiokano"
            target="_blank"
            className="rounded-full px-3 py-2 transition hover:bg-zinc-100"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/sergiocano-fullstack/"
            target="_blank"
            className="transition hover:text-indigo-600"
          >
            <span className="group relative ml-4 rounded-full border-1 border-gray-200 px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-md">
              by Sergio ✨
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
