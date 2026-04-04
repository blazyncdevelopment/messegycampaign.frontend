"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";

export default function ApiCampaignList() {
  const { project_key } = useParams();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    templateId: "",
  });

  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ---------------- FETCH ---------------- */
  const fetchData = async () => {
    try {
      setFetching(true);

      const [campaignRes, templateRes] = await Promise.all([
        api.get(`/api-campaigns?project_key=${project_key}`),
        api.get(`/templates?project_key=${project_key}`),
      ]);

      setCampaigns(campaignRes.data);
      setTemplates(templateRes.data);

    } catch {
      toast.error("Failed to load data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    if (!form.name || !form.templateId) {
      toast.error("Name & template required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api-campaigns", {
        ...form,
        project_key,
      });

      toast.success("API Campaign created 🚀");

      setOpen(false);
      setForm({ name: "", templateId: "" });

      fetchData();

    } catch {
      toast.error("Failed to create");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this API campaign?")) return;

    try {
      await api.delete(`/api-campaigns/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Trigger campaigns via API with dynamic variables
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          + New API Campaign
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden bg-white">

        <table className="w-full text-sm">

          <thead className="bg-muted">
            <tr>
              <th className="p-3">Name</th>
              <th>Template</th>
              <th>API Endpoint</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {campaigns.map((c) => (
              <tr key={c.id} className="border-t">

                <td className="p-3 font-medium">{c.name}</td>

                <td>{c.template?.name}</td>

                <td className="text-xs text-muted-foreground">
                  /api/send/{c.id}
                </td>

                <td className="text-right pr-3 space-x-2">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/workspace/${project_key}/apicampaigns/${c.id}/report`)
                    }
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>

                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>Create API Campaign</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              placeholder="Campaign name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded"
              value={form.templateId}
              onChange={(e) =>
                setForm({ ...form, templateId: Number(e.target.value) })
              }
            >
              <option value="">Select template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </Button>

          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}