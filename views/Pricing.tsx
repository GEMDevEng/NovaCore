import React, { useState, useEffect } from 'react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface PaymentProvider {
  id: string;
  name: string;
  icon: string;
}

const API_BASE_URL = 'https://backend-egj2pfaqw-gem-devs-projects.vercel.app/api/v1';

const PAYMENT_PROVIDERS: PaymentProvider[] = [
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'stripe', name: 'Stripe', icon: '💳' },
  { id: 'razorpay', name: 'Razorpay', icon: '₹' },
];

const Pricing: React.FC = () => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('paypal');
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<string>('free');

  useEffect(() => {
    fetchPricing();
    fetchUserSubscription();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/payments/pricing`);
      if (!response.ok) throw new Error('Failed to fetch pricing');
      const data = await response.json();
      setTiers(data.data.tiers);
      setError(null);
    } catch (err) {
      console.error('Error fetching pricing:', err);
      setError('Failed to load pricing information');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      // In a real app, get userId from auth context
      const userId = localStorage.getItem('userId') || 'demo-user';
      const response = await fetch(`${API_BASE_URL}/payments/subscription/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data.data.tier);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    if (tierId === currentSubscription) {
      alert('You already have this subscription');
      return;
    }

    setSelectedTier(tierId);
    setShowCheckout(true);
  };

  const handleCheckout = async () => {
    if (!selectedTier) return;

    try {
      const userId = localStorage.getItem('userId') || 'demo-user';
      const response = await fetch(`${API_BASE_URL}/payments/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tier: selectedTier,
          provider: selectedProvider,
          successUrl: `${window.location.origin}/pricing?success=true`,
          cancelUrl: `${window.location.origin}/pricing?cancelled=true`,
        }),
      });

      if (!response.ok) throw new Error('Failed to create payment session');
      const data = await response.json();

      // In production, redirect to actual payment provider
      alert(`Payment session created!\n\nIn production, you would be redirected to ${selectedProvider} checkout.\n\nSession ID: ${data.data.sessionId}`);
      setShowCheckout(false);
    } catch (err) {
      console.error('Error creating payment session:', err);
      alert('Failed to create payment session');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nova-primary"></div>
          <p className="mt-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Pricing Plans</h1>
      <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark mb-8">Choose the perfect plan for your business</p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-lg p-8 transition-all ${
              currentSubscription === tier.id
                ? 'bg-nova-primary/10 border-2 border-nova-primary'
                : 'bg-nova-card dark:bg-nova-card-dark border border-nova-border dark:border-nova-border-dark'
            }`}
          >
            <h2 className="text-2xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-2">
              {tier.name}
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-nova-primary">${tier.price}</span>
              {tier.price > 0 && <span className="text-nova-text-secondary dark:text-nova-text-secondary-dark">/month</span>}
            </div>

            {currentSubscription === tier.id && (
              <div className="mb-4 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm font-medium">
                ✓ Current Plan
              </div>
            )}

            <button
              onClick={() => handleUpgrade(tier.id)}
              disabled={currentSubscription === tier.id}
              className={`w-full py-2 rounded-lg font-medium transition-colors mb-6 ${
                currentSubscription === tier.id
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                  : 'bg-nova-primary text-white hover:bg-nova-primary/90'
              }`}
            >
              {currentSubscription === tier.id ? 'Current Plan' : 'Upgrade'}
            </button>

            <ul className="space-y-3">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-nova-text-secondary dark:text-nova-text-secondary-dark">
                  <span className="text-nova-primary mr-3">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-6">
              Select Payment Method
            </h3>

            <div className="space-y-3 mb-6">
              {PAYMENT_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedProvider === provider.id
                      ? 'border-nova-primary bg-nova-primary/10'
                      : 'border-nova-border dark:border-nova-border-dark hover:border-nova-primary'
                  }`}
                >
                  <span className="text-2xl mr-3">{provider.icon}</span>
                  <span className="font-medium text-nova-text-primary dark:text-nova-text-primary-dark">
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg text-nova-text-primary dark:text-nova-text-primary-dark hover:bg-nova-bg-light dark:hover:bg-nova-bg-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-primary/90 transition-colors"
              >
                Continue to {PAYMENT_PROVIDERS.find(p => p.id === selectedProvider)?.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

