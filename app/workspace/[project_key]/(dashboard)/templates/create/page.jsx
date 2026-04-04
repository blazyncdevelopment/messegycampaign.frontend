"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
});

export default function CreateTemplate() {
  const editorRef = useRef(null);
  const { project_key } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
const mergeTags = {
  firstName: { name: "First Name", value: "{{firstName}}" },
  lastName: { name: "Last Name", value: "{{lastName}}" },
  email: { name: "Email", value: "{{email}}" },
  phone: { name: "Phone", value: "{{phone}}" },
  company: { name: "Company", value: "{{company}}" },
  jobTitle: { name: "Job Title", value: "{{jobTitle}}" },
  website: { name: "Website", value: "{{website}}" },
  city: { name: "City", value: "{{city}}" },
  state: { name: "State", value: "{{state}}" },
  country: { name: "Country", value: "{{country}}" },
};
  /* ---------------- SAVE TEMPLATE ---------------- */
  const handleSave = async () => {
    if (!name.trim()) {
      alert("Template name required");
      return;
    }

    const editor = editorRef.current?.editor;

    if (!editor) {
      alert("Editor not ready");
      return;
    }

    try {
      setLoading(true);

      editor.exportHtml(async ({ design, html }) => {
        await api.post("/templates", {
          name,
          project_key,
          html,
          json: design,
        });

        router.push(`/workspace/${project_key}/templates`);
      });

    } catch (err) {
      console.error(err);
      alert("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between gap-4 p-4 border-b shadow-sm">

        <div className="flex gap-3 w-full max-w-md">
          <Input
            placeholder="Enter template name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Back
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save Template"
            )}
          </Button>
        </div>
      </div>

      {/* 🔥 EDITOR */}
      <div className="flex-1">
        <EmailEditor
          ref={editorRef}
          options={{
            displayMode: "email",

            appearance: {
              panels: {
                tools: {
                  dock: "left", // ✅ Zoho-style sidebar
                },
              },
            },

            mergeTags,


            features: {
              // ⚠️ Branding remove only works on paid
              branding: false,
            },
          }}
        />
      </div>

    </div>
  );
}