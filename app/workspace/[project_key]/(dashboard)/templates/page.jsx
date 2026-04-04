"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function TemplateList() {
  const { project_key } = useParams();
  const router = useRouter();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/templates?project_key=${project_key}`);
      setTemplates(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [project_key]);

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Templates</h1>

        <Button
          onClick={() =>
            router.push(`/workspace/${project_key}/templates/create`)
          }
        >
          + Create Template
        </Button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading templates...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && templates.length === 0 && (
        <div className="text-center py-20 border rounded-xl">
          <p className="text-muted-foreground mb-4">
            No templates found
          </p>
          <Button
            onClick={() =>
              router.push(`/workspace/${project_key}/templates/create`)
            }
          >
            Create First Template
          </Button>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {templates.map((t) => (
          <div
            key={t.id}
            className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() =>
              router.push(
                `/workspace/${project_key}/templates/${t.id}/edit`
              )
            }
          >

            {/* PREVIEW */}
            <div className="h-48 bg-muted overflow-hidden">
              {t.html ? (
                <div
                  className="scale-[0.4] origin-top-left w-[250%] pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: t.html }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No Preview
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-4 space-y-1">
              <h2 className="font-semibold truncate">{t.name}</h2>
              <p className="text-xs text-muted-foreground">
                Click to edit
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}