import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      const handleCallback = async () => {
        try {
          const response = await api.post('/auth/google', { code });
          const { user, accessToken } = response.data;
          setAuth(user, accessToken);
          navigate('/dashboard');
        } catch (error) {
          console.error('Auth Callback Error:', error);
          navigate('/auth?error=oauth_failed');
        }
      };

      handleCallback();
    } else {
      navigate('/auth');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center font-['Inter']">
      <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
      <h2 className="text-white text-lg font-medium">Authenticating...</h2>
      <p className="text-slate-500 text-sm">Finishing the securely sign-in process</p>
    </div>
  );
};

export default AuthCallback;
