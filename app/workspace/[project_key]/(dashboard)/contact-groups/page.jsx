"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactGroupsPage() {
  const { project_key } = useParams();

  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* ---------------- FETCH ---------------- */
  const fetchData = async () => {
    try {
      const [groupRes, contactRes] = await Promise.all([
        api.get(`/contact-groups?project_key=${project_key}`),
        api.get(`/contacts?project_key=${project_key}`),
      ]);

      setGroups(groupRes.data);
      setContacts(contactRes.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      if (!form.name) {
        toast.error("Group name required");
        return;
      }

      if (selectedGroup) {
        await api.put(`/contact-groups/${selectedGroup.id}`, form);
        toast.success("Group updated");
      } else {
        await api.post(`/contact-groups`, {
          ...form,
          project_key,
        });
        toast.success("Group created");
      }

      setForm({ name: "", description: "" });
      setSelectedGroup(null);
      fetchData();

    } catch {
      toast.error("Error saving group");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete group?")) return;

    await api.delete(`/contact-groups/${id}`);
    toast.success("Deleted");
    fetchData();
  };

  const handleEdit = (g) => {
    setSelectedGroup(g);
    setForm({
      name: g.name,
      description: g.description || "",
    });
  };

  const addToGroup = async (contactId) => {
    await api.post(`/contact-groups/${selectedGroup.id}/add`, { contactId });
    toast.success("Added");
    fetchData();
  };

  const removeFromGroup = async (contactId) => {
    await api.post(`/contact-groups/${selectedGroup.id}/remove`, { contactId });
    toast.success("Removed");
    fetchData();
  };

return (
  <div className="h-full flex gap-6 p-6 bg-muted/40">

    {/* LEFT - GROUPS */}
    <div className="w-[260px] bg-white rounded-xl border flex flex-col">

      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Groups</h2>
        <p className="text-xs text-muted-foreground">
          {groups.length} groups
        </p>
      </div>

      <div className="p-2 space-y-2 overflow-auto">
        {groups.map((g) => (
          <div
            key={g.id}
            onClick={() => setSelectedGroup(g)}
            className={`p-3 rounded-lg cursor-pointer transition
              ${
                selectedGroup?.id === g.id
                  ? "bg-black text-white"
                  : "hover:bg-muted"
              }`}
          >
            <p className="text-sm font-medium">{g.name}</p>
            <p className="text-xs opacity-70 truncate">
              {g.description}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* CENTER - FORM */}
    <div className="w-[380px] bg-white rounded-xl border p-6 space-y-5">

      <div>
        <h2 className="text-xl font-semibold">
          {selectedGroup ? "Edit Group" : "Create Group"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Organize contacts into segments
        </p>
      </div>

      <div className="space-y-3">

        <Input
          placeholder="Group name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} className="flex-1">
            {selectedGroup ? "Update" : "Create"}
          </Button>

          {selectedGroup && (
            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedGroup.id)}
            >
              Delete
            </Button>
          )}
        </div>

      </div>
    </div>

    {/* RIGHT - CONTACTS */}
    <div className="flex-1 bg-white rounded-xl border flex flex-col">

      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Contacts</h2>
        <p className="text-xs text-muted-foreground">
          {selectedGroup
            ? "Manage group members"
            : "Select a group first"}
        </p>
      </div>

      {!selectedGroup ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          No group selected
        </div>
      ) : (
        <div className="p-4 space-y-3 overflow-auto">

          {contacts.map((c) => {
            const isInGroup =
              selectedGroup.contacts?.some(
                (cg) => cg.contactId === c.id
              );

            return (
              <div
                key={c.id}
                className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted transition"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.email}
                  </p>
                </div>

                {isInGroup ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromGroup(c.id)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => addToGroup(c.id)}
                  >
                    Add
                  </Button>
                )}
              </div>
            );
          })}

        </div>
      )}
    </div>

  </div>
);
}