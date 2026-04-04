"use client"

import { LoginForm } from "@/components/login-form"
import { Rocket } from "lucide-react"

export default function LoginPage() {
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
            Manage all your customer conversations in one place
          </h2>

          <p className="text-gray-400 text-sm">
            Emails, automation, CRM — everything built for growth.
          </p>

          <div className="text-xs text-gray-500">
            Simple. Fast. Scalable.
          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6">
        <LoginForm />
      </div>

    </div>
  )
}