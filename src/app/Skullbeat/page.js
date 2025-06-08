"use client"

import StartPage from "@/app/Skullbeat/components/StartPage";
import MusicPreviewPage from "@/app/Skullbeat/components/MusicPreviewPage";
import HowPage from "@/app/Skullbeat/components/HowPage";
import GamePage from "@/app/Skullbeat/components/GamePage";
import ResultPage from "@/app/Skullbeat/components/ResultPage";
import { useState } from "react";
import {useStore} from "@/app/Skullbeat/store/store";
import FailedPage from "@/app/Skullbeat/components/FailedPage";

export default function Home() {

  const gameState= useStore( (state)=>state);

  return (
    <div>
      <> 
        <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
            { gameState.state == 0 && <StartPage/>}
            { gameState.state == 0.5 && <MusicPreviewPage />}
            { gameState.state == 0.75 && <HowPage />}
            { gameState.state == 1 && <GamePage/>}
            { gameState.state == 2 && <ResultPage />}
            { gameState.state == 3 && <FailedPage />}

        </div>
        
        
      </>
    </div>
  );
}
