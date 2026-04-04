"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function CampaignReportPage() {
  const { id, project_key } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);

  /* ---------------- FETCH ---------------- */
  const fetchReport = async () => {
    try {
      const res = await api.get(`/api-campaigns/${id}/report`);
      setData(res.data);
    } catch {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  /* ---------------- TEST SEND ---------------- */
  const handleTest = async () => {
    if (!testEmail) return toast.error("Enter email");

    try {
      setSending(true);

      await api.post("/campaigns/test", {
        campaignId: id,
        emails: [testEmail],
      });

      toast.success("Test sent 🚀");
      setTestEmail("");

    } catch {
      toast.error("Test failed");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, logs } = data;

  const deliveryRate = stats?.total
    ? ((stats.sent / stats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">

      {/* LEFT MAIN */}
      <div className="col-span-2 space-y-6">

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

          <StatCard title="Total" value={stats?.total || 0} />
          <StatCard title="Sent" value={stats?.sent || 0} color="green" />
          <StatCard title="Failed" value={stats?.failed || 0} color="red" />

        </div>

        {/* DELIVERY */}
        <div className="border rounded-xl p-5 bg-white">
          <h3 className="font-semibold mb-2">Delivery Rate</h3>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${deliveryRate}%` }}
            />
          </div>

          <p className="text-sm mt-2">{deliveryRate}% delivered</p>
        </div>

        {/* LOGS */}
        <div className="border rounded-xl overflow-hidden bg-white">

          <table className="w-full text-sm">

            <thead className="bg-muted">
              <tr>
                <th className="p-3">Email</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
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

      {/* RIGHT PANEL */}
      <div className="space-y-6">

       <div className="border rounded-xl p-5 bg-white space-y-3">
  <h3 className="font-semibold">API Usage</h3>

  <pre className="bg-black text-green-400 text-xs p-3 rounded overflow-auto">
{`curl --location 'http://localhost:4000/api/api-campaigns/send' \\
--header 'Content-Type: application/json' \\
--data-raw '{
  "project_key": "${data.project_key || "YOUR_PROJECT_KEY"}",
  "project_secret": "${data.project_secret || "YOUR_PROJECT_SECRET"}",
  "campaignId": ${id},
  "to": "test@gmail.com",
  "variables": {
    "firstName": "John",
    "lastName": "Doe",
    "company": "Example Inc"
  }
}'`}
  </pre>

  <Button
    size="sm"
    onClick={() => {
      navigator.clipboard.writeText(
`curl --location 'http://localhost:4000/api/api-campaigns/send' \
--header 'Content-Type: application/json' \
--data-raw '{
  "project_key": "${data.project_key || "YOUR_PROJECT_KEY"}",
  "project_secret": "${data.project_secret || "YOUR_PROJECT_SECRET"}",
  "campaignId": ${id},
  "to": "test@gmail.com",
  "variables": {
    "firstName": "John",
    "lastName": "Doe",
    "company": "Example Inc"
  }
}'`
      );
      toast.success("Copied 🚀");
    }}
  >
    Copy Curl
  </Button>
</div>

        {/* TEST BOX */}
        <div className="border rounded-xl p-5 bg-white space-y-3">

          <h3 className="font-semibold">Send Test</h3>

          <Input
            placeholder="Enter email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleTest}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Test"}
          </Button>

        </div>

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