import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { ScrollText, Trash2, Calendar, User, Activity, AlertTriangle } from "lucide-react";

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/logs");
      setLogs(res.data);
    } catch (err) {
      toast.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading system logs...</p>
      </div>
    );
  }

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to permanently clear all audit logs? This cannot be undone.")) return;

    try {
      await API.delete("/logs");
      toast.success("Audit logs cleared successfully");
      fetchLogs(); // refresh
    } catch (err) {
      toast.error("Failed to clear logs");
    }
  };

  // Helper to format log action codes nicely
  const getActionBadgeColor = (action) => {
    switch (action) {
      case "USER_REGISTERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "USER_LOGIN":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "ADMIN_ACTION":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">System Logs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Audit live platform operations and event logs</p>
        </div>

        <button
          type="button"
          onClick={handleClearLogs}
          disabled={logs.length === 0}
          className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 border border-rose-100 px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 w-full sm:w-auto shadow-2xs"
        >
          <Trash2 className="h-4 w-4" />
          Clear Audit Logs
        </button>
      </div>

      {/* LOGS CONTAINER */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        
        {logs.length === 0 ? (
          <div className="text-center py-10">
            <ScrollText className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-slate-500 font-medium">No system log entries cataloged.</p>
            <p className="text-xs text-slate-400 mt-0.5">Audit logs will appear as user actions occur.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div 
                key={log._id} 
                className="rounded-xl border border-slate-100 bg-white p-4 shadow-3xs flex items-start gap-3 hover:border-indigo-100 hover:shadow-2xs transition-all duration-150"
              >
                {/* Visual Icon */}
                <div className="rounded-lg bg-slate-50 p-2 text-slate-500 mt-0.5">
                  <Activity className="h-4 w-4" />
                </div>

                <div className="space-y-1 w-full min-w-0">
                  <div className="flex items-center gap-2 flex-wrap justify-between">
                    {/* Log Message */}
                    <p className="font-bold text-slate-800 text-sm break-all leading-normal">
                      {log.message}
                    </p>
                    
                    {log.action && (
                      <span className={`inline-block px-2 py-0.5 rounded-md border text-[9px] font-bold tracking-wide uppercase ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                    {log.userId?.fullName && (
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {log.userId.fullName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SystemLogs;