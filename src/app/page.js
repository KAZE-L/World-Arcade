"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const games = [
    {
      id: "AmericanSuperheroFlight",
      image: "/w-america.png",
      position: { top: "42%", left: "10%" },
      pinPosition: { top: "38%", left: "18%" }
    },
    {
      id: "BeerPouringGame",
      image: "/w-germany.png",
      position: { top: "29%", left: "52%" },
      pinPosition: { top: "29%", left: "48%" }
    },
    {
      id: "BubbleTeaPearlGame",
      image: "/w-taiwan.png",
      position: { top: "50%", left: "79%" },
      pinPosition: { top: "45%", left: "75.8%" }
    },
    {
      id: "IcelandAuroraCapture",
      image: "/w-iceland.png",
      position: { top: "15%", left: "36%" },
      pinPosition: { top: "22%", left: "39%" }
    },
    {
      id: "IslandHopping",
      image: "/w-greece.png",
      position: { top: "39%", left: "52%" },
      pinPosition: { top: "36%", left: "49%" }
    },
    {
      id: "ForestPizzaWorkshop",
      image: "/w-italy.png",
      position: { top: "41%", left: "38.5%" },
      pinPosition: { top: "36%", left: "46.5%" }
    },
    {
      id: "BullsAndCows",
      image: "/w-uk.png",
      position: { top: "32%", left: "34%" },
      pinPosition: { top: "28%", left: "42%" }
    },
    {
      id: "SavannaZoomies",
      image: "/w-kenya.png",
      position: { top: "60%", left: "47%" },
      pinPosition: { top: "55%", left: "54%" }
    },
    {
      id: "NewZealandSheepCatch",
      image: "/w-newzealand.png",
      position: { top: "75%", left: "72%" },
      pinPosition: { top: "70%", left: "80%" }
    },
    {
      id: "RagaBox",
      image: "/w-india.png",
      position: { top: "55%", left: "61%" },
      pinPosition: { top: "48%", left: "64%" }
    },
    {
      id: "ShadowRun",
      image: "/w-japan.png",
      position: { top: "33%", left: "72%" },
      pinPosition: { top: "38%", left: "80.4%" }
    },
    {
      id: "Skullbeat",
      image: "/w-mexico.png",
      position: { top: "54%", left: "11%" },
      pinPosition: { top: "50%", left: "20%" }
    }
  ];

  const StartScreen = () => (
    <div 
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#303b8e' }}
    >
      <div
        className="relative"
        style={{
          width: '100vw',
          height: '56.25vw', // 100 * 9 / 16
          maxHeight: '100vh',
          maxWidth: '177.78vh' // 100 * 16 / 9
        }}
      >
        <Image
          src="/index-bg.png"
          alt="World Arcade"
          fill
          className="object-contain"
          priority
        />
        <div
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
          style={{
            top: '50%',
            width: '30%',
            height: '20%'
          }}
          onClick={() => setGameStarted(true)}
        >
          <Image
            src="/indexStartBtn.png"
            alt="Start Button"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );

  const WorldMapScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div
        className="relative"
        style={{
          width: '100vw',
          height: '56.25vw', // 100 * 9 / 16
          maxHeight: '100vh',
          maxWidth: '177.78vh'
          // 100 * 16 / 9
        }}
      >
        <Image
          src="/w-bg.png"
          alt="World Map"
          fill
          className="object-contain"
          priority
        />
        <div
          className="absolute z-10 cursor-pointer hover:scale-110 transition-transform"
          style={{ top: '1.5%', left: '0.8%' }}
          onClick={() => setGameStarted(false)}
        >
          <div
            className="rounded-lg shadow-lg transition-colors flex items-center justify-center"
            style={{
              backgroundColor: '#986acc',
              borderColor: '#f2e5fb',
              width: '8vw',
              height: '8vw',
              maxHeight: '80px',
              maxWidth: '80px',
              minHeight: '32px',
              minWidth: '32px'
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: '#f2e5fb', width: '60%', height: '60%' }}
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
        <div className="absolute top-0 left-0 w-full h-full">
          {games.map((game) => (
            <div key={game.id}>
              <div
                className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                style={{
                  top: game.position.top,
                  left: game.position.left,
                  width: '15%',
                  height: '10%'
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
                  width: '10%',
                  height: '10%'
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
    </div>
  );

  return gameStarted ? <WorldMapScreen /> : <StartScreen />;
}
