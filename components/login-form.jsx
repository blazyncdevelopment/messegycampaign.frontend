"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }) {
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

    console.log("LOGIN RESPONSE:", res.data);

    const token = res?.data?.token;

    if (!token) {
      throw new Error("Token not received");
    }

    localStorage.setItem("token", token);

    // verify saved
    console.log("Saved Token:", localStorage.getItem("token"));

    router.push("/dashboard");

  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.msg || err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Messegy Campaign</CardTitle>
          <CardDescription>
            Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>

              <FieldSeparator>
                Continue with email
              </FieldSeparator>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel>Password</FieldLabel>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <FieldDescription className="text-center">
                  Don’t have an account?{" "}
                  <a href="/register" className="underline">
                    Sign up
                  </a>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}