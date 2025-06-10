import Link from 'next/link'

export default function IslandHopping() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Link className="bg-gray-400" href="/">
        Back
      </Link>
      <iframe
        src="https://jumping-island.vercel.app/"
        className="grow w-full"
      ></iframe>
    </div>
  )
}
