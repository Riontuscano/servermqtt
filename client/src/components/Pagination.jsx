export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="mt-6 flex justify-center items-center gap-6">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-30 font-semibold"
      >⬅ Prev</button>
      <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-30 font-semibold"
      >Next ➡</button>
    </div>
  );
}
