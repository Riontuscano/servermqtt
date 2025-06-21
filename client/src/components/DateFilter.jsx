export default function DateFilter({ fromDate, toDate, setFromDate, setToDate, deleteByDate }) {
  return (
    <div className="flex items-center gap-3 bg-card p-4 rounded shadow-md">
      <input
        type="date"
        value={fromDate}
        onChange={e => setFromDate(e.target.value)}
        className="bg-background border border-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-primary outline-none transition-all"
      />
      <span className="text-gray-400">to</span>
      <input
        type="date"
        value={toDate}
        onChange={e => setToDate(e.target.value)}
        className="bg-background border border-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-primary outline-none transition-all"
      />
      <button
        onClick={deleteByDate}
        className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition-all duration-200 font-semibold flex items-center gap-1"
      >
        <span role="img" aria-label="delete">🗑</span> Delete by Date
      </button>
    </div>
  );
}
