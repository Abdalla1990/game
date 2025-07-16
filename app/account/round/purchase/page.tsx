'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

const stripePromise = loadStripe('pk_test_51NLOu3FfF5xC6f...'); // Replace with your Stripe publishable key

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { user } = useAuth();

  const [roundsCount, setRoundsCount] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!stripe || !elements) return;

    setLoading(true);

    // Simulate payment process (replace with backend API call for real)
    // For demo: Just wait 1s and then "success"
    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
    alert(`Payment successful for ${roundsCount} round(s)!`);
    router.push('/account/create-round');
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4 border rounded text-center">
        <p className="mb-4">Please login first to purchase rounds.</p>
        <Button variant="primary" onClick={() => router.push('/auth')}>
          Login →
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Purchase Game Rounds</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="roundsCount">
            Number of rounds:
          </label>
          <input
            id="roundsCount"
            type="number"
            min={1}
            max={10}
            value={roundsCount}
            onChange={(e) => setRoundsCount(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="card-element">
            Credit Card Info:
          </label>
          <div className="p-3 border rounded bg-gray-50" id="card-element">
            <CardElement />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
          disabled={!stripe}
        >
          {loading ? 'Processing...' : `Pay for ${roundsCount} Round${roundsCount === 1 ? '' : 's'}`}
        </Button>
      </form>
    </div>
  );
}

export default function PurchasePage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
