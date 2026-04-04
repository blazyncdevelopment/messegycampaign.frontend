import { Next } from "@hugeicons/core-free-icons"
import axios from "axios"

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  // ✅ TOKEN
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  // ✅ WORKSPACE KEY (SAFE WAY)
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname || ""

    // match: /workspace/{project_key}/...
    const match = pathname.match(/\/workspace\/([^/]+)/)

    if (match && match[1]) {
      config.headers["X-Workspace-Key"] = match[1]
    }
  }

  return config
})