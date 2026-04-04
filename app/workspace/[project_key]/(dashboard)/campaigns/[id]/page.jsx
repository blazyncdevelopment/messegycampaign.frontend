"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function CampaignPage() {
  const { id, project_key } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sending, setSending] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const [testOpen, setTestOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [testEmails, setTestEmails] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  /* ---------------- FETCH ---------------- */
  const fetchData = async () => {
    try {
      const [campaignRes, templateRes, groupRes] = await Promise.all([
        api.get(`/campaigns/${id}`),
        api.get(`/templates?project_key=${project_key}`),
        api.get(`/contact-groups?project_key=${project_key}`),
      ]);

      setCampaign(campaignRes.data);
      setTemplates(templateRes.data);
      setGroups(groupRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && project_key) fetchData();
  }, [id, project_key]);

  const handleChange = (key, value) => {
    setCampaign((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/campaigns/${id}`, campaign);
      toast.success("Saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- SEND ---------------- */
  const handleSendNow = async () => {
    try {
      setSending(true);
      await api.post(`/campaigns/send`, {
        campaignId: campaign.id,
      });
      toast.success("Sent 🚀");
    } catch {
      toast.error("Send failed");
    } finally {
      setSending(false);
    }
  };

  /* ---------------- DUPLICATE ---------------- */
  const handleDuplicate = async () => {
    try {
      setDuplicating(true);
      await api.post(`/campaigns/${campaign.id}/duplicate`);
      toast.success("Duplicated");
    } catch {
      toast.error("Duplicate failed");
    } finally {
      setDuplicating(false);
    }
  };

  /* ---------------- SCHEDULE ---------------- */
  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) {
      return toast.error("Select date & time");
    }

    try {
      setScheduling(true);

      await api.post(`/campaigns/schedule`, {
        campaignId: campaign.id,
        scheduleAt: `${scheduleDate}T${scheduleTime}`,
      });

      toast.success("Scheduled ⏰");
      setScheduleOpen(false);
    } catch {
      toast.error("Schedule failed");
    } finally {
      setScheduling(false);
    }
  };

  /* ---------------- TEST ---------------- */
  const handleSendTest = async () => {
    const emails = testEmails.split(",").map((e) => e.trim());

    if (!emails.length) return toast.error("Enter emails");

    try {
      setSendingTest(true);

      await api.post("/campaigns/test", {
        campaignId: campaign.id,
        emails,
      });

      toast.success("Test sent");
      setTestOpen(false);
      setTestEmails("");
    } catch {
      toast.error("Test failed");
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h2 className="text-xl font-semibold">{campaign.name}</h2>
            <p className="text-sm text-muted-foreground">Campaign Setup</p>
          </div>

          <div className="flex gap-2 flex-wrap">

            <Button
              variant="outline"
              onClick={handleDuplicate}
              disabled={duplicating}
            >
              {duplicating && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Duplicate
            </Button>

            <Button variant="outline" onClick={() => setTestOpen(true)}>
              Test
            </Button>

            <Button variant="outline" onClick={() => setScheduleOpen(true)}>
              Schedule
            </Button>

            <Button
              onClick={handleSendNow}
              disabled={sending}
              className="bg-black text-white"
            >
              {sending && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Send Now
            </Button>

          </div>
        </div>

        {/* FORM */}
        <Section title="Campaign Name">
          <Input
            value={campaign.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Section>

        <Section title="Subject">
          <Input
            value={campaign.subject || ""}
            onChange={(e) => handleChange("subject", e.target.value)}
          />
        </Section>

        <Section title="Sender Email">
          <Input
            value={campaign.sender || ""}
            onChange={(e) => handleChange("sender", e.target.value)}
          />
        </Section>

        <Section title="Template">
          <select
            className="w-full border p-2 rounded"
            value={campaign.templateId || ""}
            onChange={(e) => handleChange("templateId", Number(e.target.value))}
          >
            <option value="">Select template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Section>

        <Section title="Audience">
          <select
            className="w-full border p-2 rounded"
            value={campaign.groups?.[0]?.groupId || ""}
            onChange={(e) => handleChange("groupId", Number(e.target.value))}
          >
            <option value="">Select group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Section>

        {/* SAVE */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
            Save
          </Button>
        </div>

      </div>

      {/* TEST MODAL */}
      <Dialog open={testOpen} onOpenChange={setTestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="email1@gmail.com, email2@gmail.com"
            value={testEmails}
            onChange={(e) => setTestEmails(e.target.value)}
          />

          <Button onClick={handleSendTest} disabled={sendingTest}>
            {sendingTest && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
            Send
          </Button>
        </DialogContent>
      </Dialog>

      {/* SCHEDULE MODAL */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Campaign</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />

            <Input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />

            <Button onClick={handleSchedule} disabled={scheduling}>
              {scheduling && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-2 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}