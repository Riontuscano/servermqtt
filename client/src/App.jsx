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

const BACKEND_URL = 'http://localhost:5500';

export default function App() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [exporting, setExporting] = useState(false);
  const [gprsOnly, setGprsOnly] = useState(false);
  const [allMacIds, setAllMacIds] = useState([]);
  const [selectedMacId, setSelectedMacId] = useState('');

  const perPage = 20;
  const totalPages = Math.ceil(totalCount / perPage);

  // Fetch all MACIDs on mount
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/data/macids`)
      .then(res => setAllMacIds(res.data))
      .catch(err => console.error('Failed to fetch MACIDs:', err));
  }, []);

  useEffect(() => {
    if (selectedMacId) {
      setLoading(true);
      axios.get(`${BACKEND_URL}/api/pets/espdata/${selectedMacId}`)
        .then(res => {
          setData(res.data);
          setTotalCount(res.data.length);
        })
        .catch(err => console.error('Failed to fetch data:', err))
        .finally(() => setLoading(false));
    } else {
      fetchData();
    }
    // eslint-disable-next-line
  }, [selectedMacId, currentPage, sortOrder]);

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

  // Filter data for GPRS only
  const filteredData = gprsOnly ? data.filter(d => Number(d.Signal) > 0) : data;

  // Filter out invalid coordinates (0, 0 or null) for map display
  const mapData = filteredData.filter(d => 
    d.Latitude && d.Longitude && 
    Number(d.Latitude) !== 0 && Number(d.Longitude) !== 0
  );

  // Get unique MACIDs (from current data)
  const uniqueMacIds = Array.from(new Set(data.map(doc => doc.MACID))).filter(Boolean);

  // Delete by MACID handler
  const handleDeleteByMacId = async (macId) => {
    if (!window.confirm(`Delete all data for MACID: ${macId}?`)) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/data/deleteByMacId`, { data: { macId } });
      alert(`Deleted all data for MACID: ${macId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete data');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 text-foreground bg-background font-sans">
      <DashboardHeader totalCount={totalCount} onExport={handleExport} />
      {/* MACID Dropdown */}
      <div className="mb-4">
        <label htmlFor="macid-select" className="mr-2 font-bold">Select MACID:</label>
        <select
          id="macid-select"
          value={selectedMacId}
          onChange={e => setSelectedMacId(e.target.value)}
          className="px-3 py-2 border rounded text-black"
        >
          <option value="">-- All Devices --</option>
          {allMacIds.map(macId => (
            <option key={macId} value={macId}>{macId}</option>
          ))}
        </select>
      </div>
      {(loading || exporting) ? (
        <Loader />
      ) : (
        <>
          {/* MACID List and Delete Buttons */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">All MACIDs</h2>
            <div className="flex flex-wrap gap-2">
              {uniqueMacIds.length === 0 ? (
                <span className="text-gray-400">No MACIDs found.</span>
              ) : (
                uniqueMacIds.map(macId => (
                  <div key={macId} className="flex items-center bg-gray-100 rounded px-3 py-1">
                    <span className="mr-2 font-mono text-black">{macId}</span>
                    <button
                      className="text-xs bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
                      onClick={() => handleDeleteByMacId(macId)}
                    >
                      Delete by MACID
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <DateFilter fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} deleteByDate={deleteByDate} />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sortOrder" className="text-sm font-medium">Sort by Date:</label>
                <select id="sortOrder" value={sortOrder} onChange={handleSortChange} className="bg-card border border-gray-700 text-white px-3 py-2 rounded">
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
              {/* GPRS Only Toggle */}
              <div className="flex items-center gap-2">
                <label htmlFor="gprsOnly" className="text-sm font-medium">GPRS only</label>
                <input
                  id="gprsOnly"
                  type="checkbox"
                  checked={gprsOnly}
                  onChange={() => setGprsOnly(v => !v)}
                  className="w-5 h-5 accent-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">📍 Location Map</h2>
            <Map data={mapData} />
          </div>
          
          <DataTable data={filteredData} currentPage={currentPage} perPage={perPage} />
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      )}
    </div>
  );
}
