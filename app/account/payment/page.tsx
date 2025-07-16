"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";

export default function PaymentPage() {
  const [card, setCard] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // TODO: Implement payment info update logic
    setTimeout(() => {
      setSaving(false);
      router.push("/account");
    }, 1000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Payment Information</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <FormInput
            label="Card Number"
            id="card-number"
            type="text"
            value={card}
            onChange={e => setCard(e.target.value)}
            required
            placeholder="1234 5678 9012 3456"
          />
          <FormInput
            label="Expiration Date"
            id="expiry"
            type="text"
            placeholder="MM/YY"
            required
          />
          <FormInput
            label="CVV"
            id="cvv"
            type="text"
            placeholder="123"
            required
            maxLength={4}
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={saving}
            fullWidth
          >
            Save Payment Info
          </Button>
        </form>
      </div>
    </div>
  );
}
