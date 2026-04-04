"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Loader2, Plus } from "lucide-react";

export default function ContactsPage() {
  const { project_key } = useParams();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  };

  const [form, setForm] = useState(emptyForm);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // FETCH
  const fetchContacts = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/contacts?project_key=${project_key}`);
      setContacts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (project_key) fetchContacts();
  }, [project_key]);

  // OPEN ADD
  const handleAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  // OPEN EDIT
  const handleEdit = (contact) => {
    setEditing(contact);
    setForm(contact);
    setOpen(true);
  };

  // SAVE
  const handleSave = async () => {
    if (!form.firstName || !form.email) {
      alert("Name & Email required");
      return;
    }

    try {
      setLoading(true);

      if (editing) {
        await api.put(`/contacts/${editing.id}`, form);
      } else {
        await api.post("/contacts", {
          ...form,
          project_key,
        });
      }

      setOpen(false);
      fetchContacts();
    } catch (err) {
      console.error(err);
      alert("Error saving contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6">

      {/* LEFT TABLE */}
      <div className="flex-1 space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contacts</h1>

          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">

            {fetching ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {contacts.map((c) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleEdit(c)}
                    >
                      <TableCell>
                        {c.firstName} {c.lastName}
                      </TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.company || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

          </CardContent>
        </Card>
      </div>

      {/* RIGHT DRAWER */}
      {open && (
        <div className="w-[350px] border-l p-6 bg-background space-y-4">

          <h2 className="text-lg font-semibold">
            {editing ? "Edit Contact" : "New Contact"}
          </h2>

          <div className="space-y-3">

            <div>
              <Label>First Name</Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  handleChange("firstName", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Company</Label>
              <Input
                value={form.company}
                onChange={(e) =>
                  handleChange("company", e.target.value)
                }
              />
            </div>

          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

        </div>
      )}

    </div>
  );
}