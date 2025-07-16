"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";

export default function EditAccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // TODO: Implement update logic
    setTimeout(() => {
      setSaving(false);
      router.push("/account");
    }, 1000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <FormInput
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <FormInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={saving}
            fullWidth
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
