"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const games = [
    {
      id: "AmericanSuperheroFlight",
      image: "/w-america.png",
      position: { top: "36%", left: "12%" },
      pinPosition: { top: "36%", left: "24%" }
    },
    {
      id: "BeerPouringGame",
      image: "/w-germany.png",
      position: { top: "24%", left: "51%" },
      pinPosition: { top: "30%", left: "48%" }
    },
    {
      id: "BubbleTeaPearlGame",
      image: "/w-taiwan.png",
      position: { top: "48%", left: "73%" },
      pinPosition: { top: "45%", left: "73%" }
    },
    {
      id: "IcelandAuroraCapture",
      image: "/w-iceland.png",
      position: { top: "8%", left: "53%" },
      pinPosition: { top: "13%", left: "50%" }
    },
    {
      id: "IslandHopping",
      image: "/w-greece.png",
      position: { top: "38%", left: "51%" },
      pinPosition: { top: "36%", left: "50.5%" }
    },
    {
      id: "ForestPizzaWorkshop",
      image: "/w-italy.png",
      position: { top: "36%", left: "36%" },
      pinPosition: { top: "36%", left: "48.5%" }
    },
    {
      id: "BullsAndCows",
      image: "/w-uk.png",
      position: { top: "15%", left: "36%" },
      pinPosition: { top: "21%", left: "50%" }
    },
    {
      id: "SavannaZoomies",
      image: "/w-kenya.png",
      position: { top: "58%", left: "42%" },
      pinPosition: { top: "56%", left: "54%" }
    },
    {
      id: "NewZealandSheepCatch",
      image: "/w-newzealand.png",
      position: { top: "77%", left: "72%" },
      pinPosition: { top: "76%", left: "83%" }
    },
    {
      id: "RagaBox",
      image: "/w-india.png",
      position: { top: "54%", left: "58%" },
      pinPosition: { top: "49%", left: "63%" }
    },
    {
      id: "ShadowRun",
      image: "/w-japan.png",
      position: { top: "24%", left: "72%" },
      pinPosition: { top: "38%", left: "77%" }
    },
    {
      id: "Skullbeat",
      image: "/w-mexico.png",
      position: { top: "52%", left: "15%" },
      pinPosition: { top: "50%", left: "26%" }
    }
  ];

  const StartScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative h-screen w-auto min-w-full">
        <Image
          src="/index-bg.png"
          alt="World Arcade"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 50%' }}
          priority
        />
        <div className="absolute top-4/7 left-1/2 transform -translate-x-1/2 translate-y-[-30%]">
          <Image
            src="/indexStartBtn.png"
            alt="Start Button"
            width={600}
            height={80}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setGameStarted(true)}
            priority
          />
        </div>
      </div>
    </div>
  );

  const WorldMapScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div className="relative w-full h-full">
        <Image
          src="/w-bg.png"
          alt="World Map"
          fill
          className="object-contain"
          priority
        />
        <div
          className="absolute top-6 left-6 z-10 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setGameStarted(false)}
        >
          <div 
            className=" p-3 rounded-lg shadow-lg transition-colors"
            style={{ 
              backgroundColor: '#a26fd8',
              borderColor: '#f2e5fb'
            }}
            // onMouseEnter={(e) => e.target.style.backgroundColor = '#9370db'}
            // onMouseLeave={(e) => e.target.style.backgroundColor = '#a26fd8'}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{ color: '#f2e5fb' }}
            >
              <path 
                d="M19 12H5M12 19L5 12L12 5" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="square" 
                strokeLinejoin="miter"
              />
            </svg>
          </div>
        </div>
        {games.map((game) => (
          <div key={game.id}>
            <div
              className="absolute cursor-pointer transform hover:scale-110 transition-transform"
              style={{
                top: game.position.top,
                left: game.position.left,
                width: '300px',
                height: '200px'
              }}
              onClick={() => window.location.href = `/${game.id}`}
            >
              <Image
                src={game.image}
                alt={game.id}
                fill
                className="object-contain"
              />
            </div>
            <div
              className="absolute"
              style={{
                top: game.pinPosition.top,
                left: game.pinPosition.left,
                width: '100px',
                height: '100px'
              }}
            >
              <Image
                src="/w-pin.png"
                alt="Location Pin"
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return gameStarted ? <WorldMapScreen /> : <StartScreen />;
}
