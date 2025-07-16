"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";

export default function ResetPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    setLoading(true);
    // TODO: Implement password reset logic
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Reset Password</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {sent ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">Password has been reset successfully!</div>
            <Button
              variant="primary"
              onClick={() => router.push("/account")}
            >
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Current Password"
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
            <FormInput
              label="New Password"
              id="new-password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <FormInput
              label="Confirm New Password"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              fullWidth
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
