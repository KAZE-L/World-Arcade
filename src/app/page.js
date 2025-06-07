"use client";

import Image from "next/image";

export default function Home() {
  const games = [
    "Skullbeat",
    "ShadowRun",
    "SavannaZoomies",
    "RagaBox",
    "NewZealandSheepCatch",
    "IslandHopping",
    "IcelandAuroraCapture",
    "ForestPizzaWorkshop",
    "BullsAndCows",
    "BubbleTeaPearlGame",
    "BeerPouringGame",
    "AmericanSuperheroFlight"
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-8">
      {games.map((game) => (
        <button
          key={game}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          onClick={() => window.location.href = `/${game}`}
        >
          {game}
        </button>
      ))}
    </div>
  );
}
