import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import { useAuthStore } from '../store/authStore';

const JoinBoard = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const joinBoard = useBoardStore((state) => state.joinBoard);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      // User must be logged in to join.
      navigate(`/auth?redirect=/join/${code}`);
      return;
    }

    const processJoin = async () => {
      try {
        const board = await joinBoard(code);
        navigate(`/board/${board.id}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to join the board');
      }
    };

    if (code) {
      processJoin();
    }
  }, [code, isAuthenticated, navigate, joinBoard]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center font-['Inter']">
      {error ? (
        <div className="bg-[#1e293b]/50 border border-white/5 p-6 rounded-2xl max-w-sm text-center">
          <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-6 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
          <h2 className="text-white text-lg font-medium">Joining Board...</h2>
          <p className="text-slate-500 text-sm">Please wait while we process your invite.</p>
        </>
      )}
    </div>
  );
};

export default JoinBoard;
