import Link from 'next/link'

export default function BubbleTeaPearlGame() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Link className="bg-gray-400" href="/">
        Back
      </Link>
      <iframe
        src="https://bubble-tea.vercel.app/"
        className="grow w-full"
      ></iframe>
    </div>
  )
}
