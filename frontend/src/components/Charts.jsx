import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const Charts = ({ jobs }) => {
  const statusData = [
    { name: "Applied", value: jobs.filter((j) => j.status === "Applied").length },
    { name: "Screening", value: jobs.filter((j) => j.status === "Screening").length },
    { name: "Interview", value: jobs.filter((j) => j.status === "Interview").length },
    { name: "Offer", value: jobs.filter((j) => j.status === "Offer").length },
    { name: "Rejected", value: jobs.filter((j) => j.status === "Rejected").length },
  ].filter((item) => item.value > 0); // Only display statuses that have active values

  const activityData = [
    { name: "Applied", count: jobs.filter((j) => j.status === "Applied").length, fill: "url(#colorApplied)" },
    { name: "Screening", count: jobs.filter((j) => j.status === "Screening").length, fill: "url(#colorScreening)" },
    { name: "Interview", count: jobs.filter((j) => j.status === "Interview").length, fill: "url(#colorInterview)" },
    { name: "Offer", count: jobs.filter((j) => j.status === "Offer").length, fill: "url(#colorOffer)" },
    { name: "Rejected", count: jobs.filter((j) => j.status === "Rejected").length, fill: "url(#colorRejected)" },
  ];

  const COLORS = {
    Applied: "#4f46e5",    // Indigo
    Screening: "#f59e0b",  // Amber
    Interview: "#8b5cf6",  // Violet/Purple
    Offer: "#10b981",      // Emerald
    Rejected: "#f43f5e",   // Rose
  };

  // Custom tooltips for a sleek modern look
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {payload[0].name}
          </p>
          <p className="text-lg font-extrabold text-slate-800">
            {payload[0].value} <span className="text-xs font-medium text-slate-500">applications</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* PIE CHART */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
        <div className="mb-4">
          <h4 className="font-bold text-slate-850 tracking-tight">Status Distribution</h4>
          <p className="text-xs text-slate-400 mt-0.5">Ratio of active application phases</p>
        </div>

        <ResponsiveContainer width="100%" height={320} debounce={200}>
          {statusData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-slate-400">No status data to display</p>
            </div>
          ) : (
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={65}
                paddingAngle={5}
                label={({ name, percent }) =>
                  percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                }
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
        <div className="mb-4">
          <h4 className="font-bold text-slate-850 tracking-tight">Funnel Overview</h4>
          <p className="text-xs text-slate-400 mt-0.5">Total counts segmented by stage</p>
        </div>

        <ResponsiveContainer width="100%" height={320} debounce={200}>
          <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Gradient definitions for extremely premium bars */}
            <defs>
              <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.95} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorScreening" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.95} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorInterview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.95} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorOffer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.95} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.95} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
              {activityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;