export default function Loader() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-4 text-gray-400 text-lg">Loading...</span>
    </div>
  );
}
