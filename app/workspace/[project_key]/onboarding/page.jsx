"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, Mail, Server } from "lucide-react";

export default function ConnectEmailPage() {
  const router = useRouter();
  const { project_key } = useParams();

  const [provider, setProvider] = useState("smtp");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    smtp_host: "",
    smtp_port: "",
    smtp_username: "",
    smtp_password: "",
    smtp_encryption: "tls",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleConnect = async () => {
    try {
      setLoading(true);

      await api.post("/onboarding/email/connect", {
        project_key: project_key, // 🔴 fix if needed
        provider,
        ...form,
      });

      alert("Email connected successfully");

      router.push(`/workspace/${project_key}/dashboard`);
    } catch (err) {
      console.error(err);
      alert("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-muted/40 p-6">

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-bold">Choose Provider</h2>

          <div className="grid grid-cols-2 gap-4">

            <Button variant="outline" onClick={() => setProvider("google")}>
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>

            <Button variant="outline" onClick={() => setProvider("microsoft")}>
              <Mail className="mr-2 h-4 w-4" />
              Microsoft
            </Button>

            <Button variant="outline" onClick={() => setProvider("zoho")}>
              <Mail className="mr-2 h-4 w-4" />
              Zoho
            </Button>

            <Button variant="default" onClick={() => setProvider("smtp")}>
              <Server className="mr-2 h-4 w-4" />
              SMTP
            </Button>

          </div>

          <p className="text-sm text-muted-foreground">
            Selected: <b>{provider.toUpperCase()}</b>
          </p>
        </Card>

        {/* RIGHT SIDE */}
        <Card>
          <CardContent className="p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Connect {provider.toUpperCase()}
            </h2>

            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* SMTP FIELDS */}
            {provider === "smtp" || provider === "zoho" ? (
              <>
                <div>
                  <Label>SMTP Host</Label>
                  <Input
                    placeholder="smtp.gmail.com"
                    value={form.smtp_host}
                    onChange={(e) =>
                      handleChange("smtp_host", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>SMTP Port</Label>
                  <Input
                    placeholder="587"
                    value={form.smtp_port}
                    onChange={(e) =>
                      handleChange("smtp_port", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Username</Label>
                  <Input
                    value={form.smtp_username}
                    onChange={(e) =>
                      handleChange("smtp_username", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.smtp_password}
                    onChange={(e) =>
                      handleChange("smtp_password", e.target.value)
                    }
                  />
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                OAuth connection will be implemented (redirect flow)
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Connect Email"}
            </Button>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}