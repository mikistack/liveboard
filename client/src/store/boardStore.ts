import { create } from 'zustand';
import api from '../lib/api';

export const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  elements: [],
  history: [], // Undo stack
  redoStack: [], // Redo stack
  isLoading: false,
  error: null,

  setElements: (elements, skipHistory = false) => {
    if (!skipHistory) {
      set((state) => ({ 
        history: [...state.history, state.elements],
        redoStack: [],
        elements 
      }));
    } else {
      set({ elements });
    }
  },

  undo: () => {
    const { history, elements, redoStack } = get();
    if (history.length === 0) return;
    
    const previous = history[history.length - 1];
    set({
      elements: previous,
      history: history.slice(0, -1),
      redoStack: [elements, ...redoStack],
    });
  },

  redo: () => {
    const { redoStack, elements, history } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[0];
    set({
      elements: next,
      redoStack: redoStack.slice(1),
      history: [...history, elements],
    });
  },
  
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),

  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map((el) => el.id === id ? { ...el, ...updates } : el)
  })),

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
      // Fetch elements after fetching board
      get().fetchElements(id);
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch board', isLoading: false });
    }
  },

  fetchElements: async (boardId) => {
    try {
      const response = await api.get(`/boards/${boardId}/elements`);
      set({ elements: response.data, history: [], redoStack: [] });
    } catch (error) {
      console.error('Failed to fetch elements', error);
    }
  },

  persistElements: async (boardId) => {
    try {
      await api.post(`/boards/${boardId}/elements`, { elements: get().elements });
    } catch (error) {
      console.error('Failed to persist elements', error);
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
