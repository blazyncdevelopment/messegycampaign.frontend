"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  Settings,
  User,
  LogOut,
  Rocket,
} from "lucide-react";

export function SiteHeader() {
  const router = useRouter();
  const { project_key } = useParams();

  const [workspaces, setWorkspaces] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get("/workspaces");
      const data = res.data || [];

      setWorkspaces(data);

      const active = data.find(
        (w) => w.project_key === project_key
      );

      setCurrent(active);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex h-(--header-height) items-center border-b bg-white">

      <div className="flex w-full items-center justify-between px-4 lg:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <SidebarTrigger className="-ml-1" />

          <Separator
            orientation="vertical"
            className="h-4"
          />

          {/* WORKSPACE SWITCH */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex gap-2">
                {current?.project_name || "Select Workspace"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.project_key}
                  onClick={() =>
                    router.push(`/workspace/${ws.project_key}/dashboard`)
                  }
                >
                  {ws.project_name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* QUICK SETUP */}
          <Button
            variant="ghost"
            onClick={() =>
              router.push(`/workspace/${project_key}/onboarding`)
            }
          >
            <Rocket className="h-4 w-4 mr-2" />
            Setup Email
          </Button>

          {/* SETTINGS */}
          <Button
            variant="ghost"
            onClick={() =>
              router.push(`/workspace/${project_key}/settings`)
            }
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* PROFILE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem
                onClick={() => router.push("/profile")}
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>

      </div>
    </header>
  );
}