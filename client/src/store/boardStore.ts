import { create } from 'zustand';
import api from '../lib/api';

export const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/boards');
      set({ boards: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch boards', isLoading: false });
    }
  },

  fetchBoardById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/boards/${id}`);
      set({ currentBoard: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch board', isLoading: false });
    }
  },

  createBoard: async (title) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/boards', { title });
      set((state) => ({ 
        boards: [response.data, ...state.boards],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create board', isLoading: false });
      throw error;
    }
  },

  joinBoard: async (shareCode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/boards/join/${shareCode}`);
      // Refresh board list after joining
      get().fetchBoards();
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to join board', isLoading: false });
      throw error;
    }
  },
}));
