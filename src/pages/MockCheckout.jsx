import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useSubscriptionStore from '../store/useSubscriptionStore';
import useAuthStore from '../store/useAuthStore';

export default function MockCheckout() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'monthly';
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { checkout } = useSubscriptionStore();
  const { fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  const planDetails = {
    monthly: { name: 'Monthly Premium', price: '$9.99/month' },
    yearly: { name: 'Yearly Premium', price: '$79.99/year' },
  };
  const plan = planDetails[planId] || planDetails.monthly;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) { toast.error('Please fill all fields'); return; }
    setProcessing(true);
    try {
      await checkout(planId);
      await fetchProfile();
      setSuccess(true);
      toast.success('Subscription activated!');
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-green-600" size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Premium!</h1>
        <p className="text-gray-500 mb-8">You now have access to all premium features including AI video interviews, resume reviews, and detailed analytics.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Complete your subscription to unlock premium features</p>

      {/* Order Summary */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">{plan.name}</span>
          <span className="font-semibold text-gray-900">{plan.price}</span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <FiLock size={12} /> This is a simulated payment. No real charges.
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FiCreditCard size={18} /> Payment Details
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
            className="input-field" placeholder="4242 4242 4242 4242" maxLength={19} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
            <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)}
              className="input-field" placeholder="MM/YY" maxLength={5} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)}
              className="input-field" placeholder="123" maxLength={4} />
          </div>
        </div>
        <button type="submit" disabled={processing} className="btn-primary w-full">
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </span>
          ) : `Pay ${plan.price}`}
        </button>
      </form>
    </div>
  );
}
