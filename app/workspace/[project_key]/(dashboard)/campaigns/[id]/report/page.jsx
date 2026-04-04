"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CampaignReportPage() {
  const { id, project_key } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH REPORT ---------------- */
  const fetchReport = async () => {
    try {
      const res = await api.get(`/campaigns/${id}/report`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, logs } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-muted-foreground">{data.subject}</p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            router.push(`/workspace/${project_key}/campaigns`)
          }
        >
          Back
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">

        <StatCard
          title="Total Contacts"
          value={stats?.total || 0}
        />

        <StatCard
          title="Sent"
          value={stats?.sent || 0}
          color="green"
        />

        <StatCard
          title="Failed"
          value={stats?.failed || 0}
          color="red"
        />

      </div>

      {/* DELIVERY RATE */}
      <div className="border rounded-xl p-5 bg-white">
        <h3 className="font-semibold mb-3">Delivery Rate</h3>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-3"
            style={{
              width: `${stats?.total ? (stats.sent / stats.total) * 100 : 0}%`,
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          {stats?.total
            ? ((stats.sent / stats.total) * 100).toFixed(1)
            : 0}
          % delivered
        </p>
      </div>

      {/* LOG TABLE */}
      <div className="border rounded-xl overflow-hidden bg-white">

        <table className="w-full text-sm">

          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-3">Email</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>

            {logs?.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-6 text-muted-foreground">
                  No logs found
                </td>
              </tr>
            )}

            {logs?.map((log, i) => (
              <tr key={i} className="border-t">

                <td className="p-3">{log.email}</td>

                <td>
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${log.status === "sent" && "bg-green-100 text-green-600"}
                    ${log.status === "failed" && "bg-red-100 text-red-600"}
                  `}>
                    {log.status}
                  </span>
                </td>

                <td className="text-muted-foreground">
                  {new Date(log.time).toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function StatCard({ title, value, color }) {
  return (
    <div className="border rounded-xl p-5 bg-white">

      <p className="text-sm text-muted-foreground">{title}</p>

      <h2
        className={`text-2xl font-bold mt-2
        ${color === "green" && "text-green-600"}
        ${color === "red" && "text-red-600"}
      `}
      >
        {value}
      </h2>

    </div>
  );
}