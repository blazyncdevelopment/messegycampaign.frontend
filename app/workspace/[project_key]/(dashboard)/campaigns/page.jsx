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

export default function CampaignList() {
  const { project_key } = useParams();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    subject: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ---------------- FETCH ---------------- */
  const fetchCampaigns = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/campaigns?project_key=${project_key}`);
      setCampaigns(res.data);
    } catch {
      toast.error("Failed to load campaigns");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Campaign name required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/campaigns", {
        name: form.name,
        subject: form.subject || null,
        project_key,
      });

      toast.success("Campaign created 🚀");

      setOpen(false);
      setForm({ name: "", subject: "" });

      fetchCampaigns();

      router.push(`/workspace/${project_key}/campaigns/${res.data.id}`);

    } catch {
      toast.error("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this campaign?")) return;

    try {
      await api.delete(`/campaigns/${id}`);
      toast.success("Deleted");
      fetchCampaigns();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- DUPLICATE ---------------- */
  const handleDuplicate = async (id) => {
    try {
      await api.post(`/campaigns/${id}/duplicate`);
      toast.success("Duplicated");
      fetchCampaigns();
    } catch {
      toast.error("Duplicate failed");
    }
  };

  /* ---------------- LOADING ---------------- */
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
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Manage your campaigns
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="bg-black text-white"
        >
          + New Campaign
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden bg-white">

        <table className="w-full text-sm">

          {/* HEAD */}
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {campaigns.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-muted-foreground">
                  No campaigns found
                </td>
              </tr>
            )}

            {campaigns.map((c) => (
              <tr
                key={c.id}
                className="border-t hover:bg-muted/50 transition"
              >

                {/* NAME */}
                <td
                  className="p-3 font-medium cursor-pointer"
                  onClick={() =>
                    router.push(`/workspace/${project_key}/campaigns/${c.id}`)
                  }
                >
                  {c.name}
                </td>

                {/* SUBJECT */}
                <td className="text-muted-foreground">
                  {c.subject || "-"}
                </td>

                {/* STATUS */}
                <td>
                  <span className={`text-xs px-2 py-1 rounded-full uppercase
                    ${c.status === "sent" && "bg-green-100 text-green-600"}
                    ${c.status === "scheduled" && "bg-yellow-100 text-yellow-600"}
                    ${c.status === "draft" && "bg-gray-100 text-gray-600"}
                  `}>
                    {c.status}
                  </span>
                </td>

                {/* DATE */}
                <td>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                <td className="text-right pr-3 space-x-2">

                 <Button
  size="sm"
  variant="outline"
  onClick={() => {
    if (c.status === "sent") {
      router.push(`/workspace/${project_key}/campaigns/${c.id}/report`);
    } else {
      router.push(`/workspace/${project_key}/campaigns/${c.id}`);
    }
  }}
>
  {c.status === "sent" ? "View Report" : "Edit"}
</Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicate(c.id)}
                  >
                    Duplicate
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

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              placeholder="Campaign name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              placeholder="Subject (optional)"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
            />

            <Button
              className="w-full bg-black text-white"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Campaign"}
            </Button>

          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}