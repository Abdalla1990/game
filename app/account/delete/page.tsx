"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";

export default function DeleteAccountPage() {
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirm !== "DELETE") return;
    setDeleting(true);
    // TODO: Implement delete account logic
    setTimeout(() => {
      setDeleting(false);
      router.push("/auth");
    }, 1000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-8 text-red-600">Delete Account</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Warning</h2>
            <p className="text-red-600">
              This action cannot be undone. All your data, including game history and settings, will be permanently deleted.
            </p>
          </div>
        </div>
        <form onSubmit={handleDelete} className="space-y-6">
          <p className="text-gray-700">
            To confirm deletion, type <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE</span> below:
          </p>
          <FormInput
            label="Confirmation"
            id="confirm"
            type="text"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="danger"
            isLoading={deleting}
            disabled={confirm !== "DELETE"}
            fullWidth
          >
            Delete Account
          </Button>
        </form>
      </div>
    </div>
  );
}
