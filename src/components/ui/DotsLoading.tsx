export default function DotsLoading() {
  return (
    <div className="mt-8 flex items-center justify-center space-x-2 dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="bg-gray-1 size-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
      <div className="bg-gray-1 size-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
      <div className="bg-gray-1 size-2 animate-bounce rounded-full"></div>
    </div>
  );
}
