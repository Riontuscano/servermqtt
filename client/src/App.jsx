import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const BACKEND_URL = 'https://servermqtt.onrender.com';

export default function App() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);

  const perPage = 20;
  const totalPages = Math.ceil(totalCount / perPage);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/data?page=${currentPage}&limit=${perPage}`);
      setData(res.data.docs);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteByDate = async () => {
    if (!fromDate || !toDate) return alert("Select both dates");
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/data/deleteByDate`, {
        data: { from: fromDate, to: toDate }
      });
      alert(res.data.message);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 text-foreground bg-background font-sans">
      <motion.h1 
        className="text-3xl font-bold text-center mb-8 text-primary"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        📊 ESP32 Data Dashboard
      </motion.h1>

      <motion.div 
        className="mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-lg">Total Documents: <span className="text-primary font-semibold">{totalCount}</span></p>
      </motion.div>

      <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
          className="bg-card border border-gray-700 text-white px-4 py-2 rounded" />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
          className="bg-card border border-gray-700 text-white px-4 py-2 rounded" />
        <button
          onClick={deleteByDate}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-200"
        >🗑 Delete by Date</button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <table className="w-full text-sm text-left border-collapse bg-card text-foreground">
          <thead className="bg-gray-900">
  <tr>
    <th className="px-4 py-2 border-b">#</th>
    <th className="px-4 py-2 border-b">SIM</th>
    <th className="px-4 py-2 border-b">MACID</th>
    <th className="px-4 py-2 border-b">Lat</th>
    <th className="px-4 py-2 border-b">Long</th>
    <th className="px-4 py-2 border-b">Battery</th>
    <th className="px-4 py-2 border-b">Steps</th>
    <th className="px-4 py-2 border-b">WiFi</th>
    <th className="px-4 py-2 border-b">Signal</th>
    <th className="px-4 py-2 border-b">Breed</th> {/* 🐾 Added */}
    <th className="px-4 py-2 border-b">Time</th>
  </tr>
</thead>

            <tbody>
              {data.map((doc, i) => (
                <tr key={doc._id} className="hover:bg-gray-800 transition-all duration-200">
  <td className="px-4 py-2 border-b">{(currentPage - 1) * perPage + i + 1}</td>
  <td className="px-4 py-2 border-b">{doc.SIM}</td>
  <td className="px-4 py-2 border-b">{doc.MACID}</td>
  <td className="px-4 py-2 border-b">{doc.Latitude}</td>
  <td className="px-4 py-2 border-b">{doc.Longitude}</td>
  <td className="px-4 py-2 border-b">{doc.Battery}</td>
  <td className="px-4 py-2 border-b">{doc.StepCount}</td>
  <td className="px-4 py-2 border-b">{doc.WiFi}</td>
  <td className="px-4 py-2 border-b">{doc.Signal}</td>
  <td className="px-4 py-2 border-b">{doc.BreedFactor ?? '—'}</td> {/* 🐶 BreedFactor */}
  <td className="px-4 py-2 border-b">{format(new Date(doc.createdAt), 'yyyy-MM-dd HH:mm')}</td>
</tr>

              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <div className="mt-6 flex justify-center items-center gap-6">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-30"
        >⬅ Prev</button>
        <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-30"
        >Next ➡</button>
      </div>
    </div>
  );
}
