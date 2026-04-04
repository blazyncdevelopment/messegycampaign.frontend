"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Send,
  Bot,
  BarChart3,
  Plug,
  Settings,
  LogOut,
  MessageCircle
} from "lucide-react"

import { api } from "@/lib/api"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AppSidebar({ plan }) {
  const router = useRouter()
  const pathname = usePathname()
  const { project_key } = useParams()

  const [workspaces, setWorkspaces] = useState([])

  const makeHref = (path) => `/workspace/${project_key}/${path}`
  const isActive = (path) => pathname.startsWith(makeHref(path))

  /* ---------------- WORKSPACES ---------------- */
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/workspaces")
        setWorkspaces(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchWorkspaces()
  }, [])

  return (
    <Sidebar className="p-2">

      {/* HEADER */}
      <SidebarHeader>
        <div className="space-y-2">
          <p className="text-lg font-bold">Messegy</p>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>

        {/* DASHBOARD */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("dashboard")}
                onClick={() => router.push(makeHref("dashboard"))}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* INBOX */}
        <SidebarGroup>
          <SidebarMenu>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("inbox")}
                onClick={() => router.push(makeHref("inbox"))}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Inbox</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>

        {/* AUDIENCE */}
        <SidebarGroup>
          <SidebarGroupLabel>Audience</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("contacts")}
                onClick={() => router.push(makeHref("contacts"))}
              >
                <Users className="h-4 w-4" />
                <span>Contacts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("contact-groups")}
                onClick={() => router.push(makeHref("contact-groups"))}
              >
                <Users className="h-4 w-4" />
                <span>Contacts Group</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>


        {/* CONTENT */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("templates")}
                onClick={() => router.push(makeHref("templates"))}
              >
                <FileText className="h-4 w-4" />
                <span>Templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* CAMPAIGNS */}
        <SidebarGroup>
          <SidebarGroupLabel>Campaigns</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("campaigns")}
                onClick={() => router.push(makeHref("campaigns"))}
              >
                <Send className="h-4 w-4" />
                <span>All Campaigns</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("apicampaigns")}
                onClick={() => router.push(makeHref("apicampaigns"))}
              >
                <Send className="h-4 w-4" />
                <span>API Campaigns</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* AUTOMATION */}
        <SidebarGroup>
          <SidebarGroupLabel>Automation</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("automation")}
                onClick={() => router.push(makeHref("automation"))}
              >
                <Bot className="h-4 w-4" />
                <span>Workflows</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* ANALYTICS */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("analytics")}
                onClick={() => router.push(makeHref("analytics"))}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* SETTINGS */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("settings")}
                onClick={() => router.push(makeHref("settings"))}
              >
                <Settings className="h-4 w-4" />
                <span>Workspace Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/login")
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}