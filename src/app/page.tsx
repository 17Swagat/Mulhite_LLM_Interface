import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-blue-900 text-9xl">
      Hello
      <Link href="/about" className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl">
        About
      </Link>
      <Link href="/profile" className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl">
        Profile
      </Link>
    </div>
  );
}
