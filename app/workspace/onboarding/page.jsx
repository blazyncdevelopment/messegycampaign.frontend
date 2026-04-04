"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Loader2, Rocket } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    project_name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.project_name) {
      alert("Workspace name required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/workspaces", form);
      const workspace = res.data;

      router.push(`/workspace/${workspace.project_key}/dashboard`);
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-black to-gray-900 text-white">

        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <Rocket className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Messegy</h1>
          </div>

          <h2 className="text-3xl font-semibold leading-tight">
            Build your customer communication system
          </h2>

          <p className="text-gray-400 text-sm">
            Manage emails, automate workflows, and scale your customer
            conversations — all in one place.
          </p>

          <div className="text-xs text-gray-500">
            Trusted by growing businesses 🚀
          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6">

        <div className="w-full max-w-md space-y-6">

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              Create Workspace
            </h1>

            <p className="text-sm text-muted-foreground">
              Start your first project in seconds
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">

            <div>
              <Label>Workspace Name</Label>
              <Input
                placeholder="e.g. Messegy CRM"
                className="mt-1"
                value={form.project_name}
                onChange={(e) =>
                  handleChange("project_name", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                placeholder="Short description..."
                className="mt-1"
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
              />
            </div>

          </div>

          {/* ACTION */}
          <Button
            className="w-full h-11 text-base"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Workspace"
            )}
          </Button>

        </div>

      </div>

    </div>
  );
}