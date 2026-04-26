import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useSubscriptionStore from '../store/useSubscriptionStore';
import useAuthStore from '../store/useAuthStore';
import Loader from '../components/common/Loader';
// import axios from 'axios';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';

export default function Pricing() {
  const { plans, fetchPlans, fetchStatus, currentPlan } = useSubscriptionStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stripeProcessing,setStripeProcessing]=useState(false);

  useEffect(() => {
    Promise.all([fetchPlans(), fetchStatus()]).finally(() => setLoading(false));
  }, [fetchPlans, fetchStatus]);

  const handleSubmit=async (planId)=>{
    setStripeProcessing(true);
    try{
      const { data } = await api.post(API_PATHS.SUBSCRIPTIONS.CHECKOUTBYSTRIPE,{planId});
      
      window.location.href=data.url;
      setStripeProcessing(false);
    }
    catch(error){
    setStripeProcessing(false);
  
    navigate('/cancel');
      // throw error;
    }

  }
  

  if (loading) return <Loader text="Loading plans..." />;
  if (stripeProcessing) return <Loader text="please wait..."/>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-500 mt-2">Unlock all features to supercharge your interview preparation</p>
        {currentPlan?.isPremium && (
          <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <FiStar size={14} /> Active: {currentPlan.plan} plan
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan?.plan === plan.id;
          const isHighlighted = plan.id === 'monthly';
          return (
            <div key={plan.id} className={`card relative ${isHighlighted ? 'border-indigo-600 ring-2 ring-indigo-600' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
              {isHighlighted && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">CURRENT PLAN</div>
              )}
              <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
              <div className="mt-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500 text-sm">/{plan.period}</span>
              </div>
              {plan.savings && <p className="text-green-600 text-sm font-medium mb-3">Save {plan.savings}</p>}
              <ul className="space-y-2 my-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <FiCheck className="text-green-500 flex-shrink-0 mt-0.5" size={16} /> {f}
                  </li>
                ))}
              </ul>
              {plan.id === 'free' ? (
                <button disabled className="btn-secondary w-full text-sm">{isCurrentPlan ? 'Current Plan' : 'Free Forever'}</button>
              ) : isCurrentPlan ? (
                <button disabled className="btn-secondary w-full text-sm">Current Plan</button>
              ) : (
                // <button onClick={() => navigate(`/checkout?plan=${plan.id}`)}
                //   className={`w-full text-sm ${isHighlighted ? 'btn-primary' : 'btn-secondary'}`}>
                //   {user?.isPremium ? 'Switch Plan' : 'Upgrade Now'}
                // </button>
               <button onClick={() =>handleSubmit(plan.id)}
                  className={`w-full text-sm ${isHighlighted ? 'btn-primary' : 'btn-secondary'}`}>
                  {user?.isPremium ? 'Switch Plan' : 'Upgrade Now'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
