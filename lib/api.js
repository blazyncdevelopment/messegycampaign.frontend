import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Inject workspace key automatically
  const pathParts = window.location.pathname.split("/")
  const workspaceIndex = pathParts.indexOf("workspace")

  if (workspaceIndex !== -1) {
    const projectKey = pathParts[workspaceIndex + 1]
    if (projectKey) {
      config.headers["X-Workspace-Key"] = projectKey
    }
  }

  return config
})