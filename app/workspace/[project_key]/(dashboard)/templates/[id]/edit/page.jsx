"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
});

export default function EditTemplatePage() {
  const editorRef = useRef(null);

  const { id, project_key } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH TEMPLATE ---------------- */
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await api.get(`/templates/${id}`);
        setTemplate(res.data);
        setName(res.data.name);
      } catch (err) {
        console.error(err);
        alert("Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  /* ---------------- LOAD DESIGN (FIXED) ---------------- */
  useEffect(() => {
    if (template && editorRef.current?.editor) {
      try {
        editorRef.current.editor.loadDesign(template.json);
      } catch (err) {
        console.error("Design load failed:", err);
      }
    }
  }, [template]);

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!name) {
      alert("Template name required");
      return;
    }

    try {
      setSaving(true);

      const editor = editorRef.current?.editor;

      if (!editor) {
        alert("Editor not ready");
        return;
      }

      editor.exportHtml(async (data) => {
        const { design, html } = data;

        await api.put(`/templates/${id}`, {
          name,
          html,
          json: design,
        });

        router.push(`/workspace/${project_key}/templates`);
      });

    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!confirm("Delete this template?")) return;

    try {
      await api.delete(`/templates/${id}`);
      router.push(`/workspace/${project_key}/templates`);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
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
  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 p-4 border-b bg-white shadow-sm">

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template name"
          className="max-w-md"
        />

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>

          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>

          <Button onClick={handleUpdate} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="h-[calc(100vh-70px)]">
        <EmailEditor
          ref={editorRef}
          options={{
            displayMode: "email",

            appearance: {
              panels: {
                tools: {
                  dock: "left", // ✅ sidebar left
                },
              },
            },
            mergeTags,
       

            features: {
              branding: false, // ⚠️ only works if allowed
            },
          }}
        />
      </div>

    </div>
  );
}