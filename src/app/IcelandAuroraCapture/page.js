import Link from 'next/link'

export default function IcelandAuroraCapture() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Link className="bg-gray-400" href="/">
        Back
      </Link>
      <iframe src="/aurora/index.html" className="grow w-full"></iframe>
    </div>
  );
}
