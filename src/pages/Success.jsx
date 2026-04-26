
import { FiCheck } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { API_PATHS } from '../utils/apiPaths';
import useAuthStore from '../store/useAuthStore';
import { useEffect } from 'react';


const Success = () => {

  const navigate = useNavigate();
  const { fetchProfile } = useAuthStore();
  
  const [searchParams]=useSearchParams();
  const planId = searchParams.get('planId') || 'monthly';
  
  useEffect(()=>{
  (async ()=>{
    try {
        await api.post(API_PATHS.SUBSCRIPTIONS.PLANID,{planId});
        await fetchProfile();
        toast.success('Subscription activated!');
    }
    catch (error){
      toast.error('Payment failed. Please try again.');
    
    }


  })()
  },[])

    //   toast.success('Subscription activated!');


  return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-green-600" size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Premium!</h1>
        <p className="text-gray-500 mb-8">You now have access to all premium features including AI video interviews, resume reviews, and detailed analytics.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
      </div>
  )
}

export default Success