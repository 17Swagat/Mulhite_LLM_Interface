export function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-700/40 via-pink-600/80 to-red-800/90">
      <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white ml-4"></div>
    </div>
  );
}
