"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ proper validation
    if (!form.name || !form.email || !form.password) {
      alert("Name, email & password required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });

      // 🔥 better UX → auto login flow bhi bana sakte hain later
      router.push("/login");

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Create your account 🚀
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started with Messegy in seconds
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleRegister} className="space-y-4">

        <div>
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="John Doe"
            className="mt-1"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="mt-1"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Phone (optional)</Label>
          <Input
            type="tel"
            placeholder="9876543210"
            className="mt-1"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            className="mt-1"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            className="mt-1"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
            "Create Account"
          )}
        </Button>

      </form>

      {/* FOOTER */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="underline font-medium">
          Login
        </a>
      </p>

    </div>
  );
}