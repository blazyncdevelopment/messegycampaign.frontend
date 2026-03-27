"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setIsAuth(true);
    }
  }, []);

  if (!isAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="py-4 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}