import Link from 'next/link'

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Link className="bg-gray-400" href="/">
        Back
      </Link>
      <iframe
        src="https://pizza-game-theta.vercel.app/"
        className="grow w-full"
      ></iframe>
    </div>
  )
}
