"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function ContactsPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    city: "",
    state: "",
    country: "",
    website: "",
  });

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // 🔌 Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ➕ Add contact
  const handleSubmit = async () => {
    try {
      setLoading(true);

      await api.post("/contacts", form);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        city: "",
        state: "",
        country: "",
        website: "",
      });

      fetchContacts(); // 🔥 refresh table
    } catch (err) {
      console.error(err);
      alert("Error adding contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Contacts</h1>

      {/* FORM */}
      <Card>
        <CardContent className="p-6 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
            </div>

            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
            </div>

            <div>
              <Label>Job Title</Label>
              <Input value={form.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Contact"}
          </Button>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="p-6">

          <h2 className="text-lg font-semibold mb-4">Contact List</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Job</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {c.firstName} {c.lastName}
                    </TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.company}</TableCell>
                    <TableCell>{c.jobTitle}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </div>
  );
}