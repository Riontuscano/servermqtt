import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function DataTable({ data, currentPage, perPage }) {
  return (
    <motion.div
      className="overflow-x-auto rounded shadow-lg bg-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <table className="w-full text-sm text-left border-collapse text-foreground">
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
            <th className="px-4 py-2 border-b">Breed</th>
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
              <td className="px-4 py-2 border-b">{doc.BreedFactor ?? '—'}</td>
              <td className="px-4 py-2 border-b">{format(new Date(doc.createdAt), 'yyyy-MM-dd HH:mm')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
