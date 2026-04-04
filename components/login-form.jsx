"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res?.data?.token;

      if (!token) throw new Error("Token not received");

      localStorage.setItem("token", token);

      router.push("/workspace");

    } catch (err) {
      alert(err?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Welcome back 👋
        </h1>

        <p className="text-sm text-muted-foreground">
          Login to continue to your dashboard
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-4">

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            className="mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Login"
          )}
        </Button>

      </form>

      {/* FOOTER */}
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <a href="/register" className="underline font-medium">
          Sign up
        </a>
      </p>

    </div>
  );
}