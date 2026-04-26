import React from 'react'
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiX className="text-red-600" size={40} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
      <p className="text-gray-500 mb-8">
        Your subscription process was cancelled. You can try again to unlock premium features.
      </p>
      <button onClick={() => navigate('/pricing')} className="btn-danger">
        Try Again
      </button>
    </div>
  )
}

export default Cancel
