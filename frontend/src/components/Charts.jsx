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
} from "recharts";

const Charts = ({ jobs }) => {

  const statusData = [
    { name: "Applied", value: jobs.filter(j => j.status === "Applied").length },
    { name: "Screening", value: jobs.filter(j => j.status === "Screening").length },
    { name: "Interview", value: jobs.filter(j => j.status === "Interview").length },
    { name: "Offer", value: jobs.filter(j => j.status === "Offer").length },
    { name: "Rejected", value: jobs.filter(j => j.status === "Rejected").length },
  ];

  const activityData = [
    { name: "Total", count: jobs.length },
    { name: "Interview", count: jobs.filter(j => j.status === "Interview").length },
    { name: "Offer", count: jobs.filter(j => j.status === "Offer").length },
    { name: "Rejected", count: jobs.filter(j => j.status === "Rejected").length },
  ];

  const COLORS = {
    Applied: "#3B82F6",
    Screening: "#F59E0B",
    Interview: "#8B5CF6",
    Offer: "#10B981",
    Rejected: "#EF4444",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* PIE CHART */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="font-semibold text-lg mb-4 text-slate-700">
          Application Status Distribution
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={70}
              paddingAngle={4}
              label={({ name, percent }) =>
                percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
              }
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[entry.name]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #eee",
              }}
            />

            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="font-semibold text-lg mb-4 text-slate-700">
          Application Overview
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={activityData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Charts;