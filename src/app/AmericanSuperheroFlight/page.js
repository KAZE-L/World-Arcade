'use client'
import Link from 'next/link'

export default function ShadowRun() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Link className="bg-gray-400" href="/">
        Back
      </Link>
      <iframe
        src="https://superhero-game.vercel.app"
        className="grow w-full"
      ></iframe>
    </div>
  )
}
