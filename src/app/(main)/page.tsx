import Link from "next/link";
export default function Home() {
  return (
    <div className=" text-5xl h-screen flex items-center justify-center bg-blue-900">
      <div className="flex gap-2">
        <Link
          href="/graph"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:brightness-150 active:brightness-75"
        >
          Click
        </Link>
        <Link
          href="/login"
          className="bg-red-500 text-white py-2 px-4 rounded hover:brightness-150 active:brightness-75"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
