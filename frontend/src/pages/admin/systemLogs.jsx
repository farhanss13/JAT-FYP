import { useEffect, useState } from "react";
import API from "../../services/api";

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs");
      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const clearLogs = async () => {
    try {
      await API.delete("/logs");
      fetchLogs(); // refresh
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">System Logs</h1>
          <p className="text-slate-500 mt-1">Track recent system activity</p>
        </div>

        <button
          type="button"
          onClick={clearLogs}
          className="cursor-pointer rounded-xl bg-rose-100 px-4 py-2 font-semibold text-rose-700 w-full sm:w-auto hover:bg-rose-200/80"
        >
          Clear Logs
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm space-y-2">
        {logs.length === 0 ? (
          <p className="rounded-lg border border-slate-200 p-4 text-slate-500">No logs found.</p>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold text-slate-900 wrap-break-word">{log.message}</p>
              <p className="text-sm text-slate-500">
                {log.userId?.fullName} • {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemLogs;