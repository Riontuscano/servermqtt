import { motion } from 'framer-motion';

export default function DashboardHeader({ totalCount, onExport }) {
  return (
    <motion.header
      className="mb-8 text-center flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div>
        <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight">📊 ESP32 Data Dashboard</h1>
        <p className="text-lg text-gray-300">Total Documents: <span className="text-primary font-semibold">{totalCount}</span></p>
      </div>
      <button
        onClick={onExport}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow font-semibold transition-all duration-200 flex items-center gap-2"
      >
       Export to Excel
      </button>
    </motion.header>
  );
}
