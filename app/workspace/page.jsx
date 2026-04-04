"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Loader2, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspacePage() {
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔌 Fetch Workspaces (same like contacts)
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);

      const res = await api.get("/workspaces");

      console.log("WORKSPACES:", res.data);

      setWorkspaces(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);

      // 🔴 only logout on 401
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getEmailProviderBadge = (provider) => {
    switch (provider) {
      case "google":
        return "bg-blue-100 text-blue-700";
      case "microsoft":
        return "bg-indigo-100 text-indigo-700";
      case "smtp":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-10">

      <h1 className="text-2xl font-bold">Workspaces</h1>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

        <Button onClick={() => router.push("/workspace/onboarding")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">

          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Provider</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {workspaces.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No workspaces found
                </td>
              </tr>
            ) : (
              workspaces.map((ws) => (
                <tr
                  key={ws.project_key}
                  className="border-t hover:bg-muted/40 cursor-pointer"
                  onClick={() =>
                    router.push(`/workspace/${ws.project_key}/dashboard`)
                  }
                >
                  <td className="p-4 font-medium">
                    {ws.project_name}
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {ws.description || "-"}
                  </td>

                  <td className="p-4">
                    {ws.email || "Not connected"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getEmailProviderBadge(
                        ws.email_provider
                      )}`}
                    >
                      {ws.email_provider || "none"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        ws.is_email_connected
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {ws.is_email_connected ? "Connected" : "Not Connected"}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(ws.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}