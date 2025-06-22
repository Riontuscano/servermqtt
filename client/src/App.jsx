import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import DashboardHeader from './components/DashboardHeader';
import DateFilter from './components/DateFilter';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';
import Loader from './components/Loader';
import Map from './components/Map';
import * as XLSX from 'xlsx';

const BACKEND_URL = 'https://servermqtt.onrender.com';

export default function App() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [exporting, setExporting] = useState(false);

  const perPage = 20;
  const totalPages = Math.ceil(totalCount / perPage);

  useEffect(() => {
    fetchData();
  }, [currentPage, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/data?page=${currentPage}&limit=${perPage}&sort=${sortOrder}`);
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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/data?page=1&limit=10000&sort=${sortOrder}`);
      const allData = res.data.docs;
      const worksheet = XLSX.utils.json_to_sheet(allData.map((doc, i) => ({
        '#': i + 1,
        SIM: doc.SIM,
        MACID: doc.MACID,
        Latitude: doc.Latitude,
        Longitude: doc.Longitude,
        Battery: doc.Battery,
        StepCount: doc.StepCount,
        WiFi: doc.WiFi,
        Signal: doc.Signal,
        BreedFactor: doc.BreedFactor,
        Time: new Date(doc.createdAt).toLocaleString()
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ESP32 Data');
      XLSX.writeFile(workbook, 'esp32_data.xlsx');
    } catch (err) {
      alert('Failed to export data');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 text-foreground bg-background font-sans">
      <DashboardHeader totalCount={totalCount} onExport={handleExport} />
      {(loading || exporting) ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <DateFilter fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} deleteByDate={deleteByDate} />
            <div className="flex items-center gap-2">
              <label htmlFor="sortOrder" className="text-sm font-medium">Sort by Date:</label>
              <select id="sortOrder" value={sortOrder} onChange={handleSortChange} className="bg-card border border-gray-700 text-white px-3 py-2 rounded">
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">📍 Location Map</h2>
            <Map data={data} />
          </div>
          
          <DataTable data={data} currentPage={currentPage} perPage={perPage} />
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      )}
    </div>
  );
}
