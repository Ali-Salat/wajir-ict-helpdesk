
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KnowledgeArticle } from '../../types';

interface KnowledgeState {
  articles: KnowledgeArticle[];
  currentArticle: KnowledgeArticle | null;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
}

const initialState: KnowledgeState = {
  articles: [],
  currentArticle: null,
  isLoading: false,
  searchQuery: '',
  selectedCategory: '',
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setArticles: (state, action: PayloadAction<KnowledgeArticle[]>) => {
      state.articles = action.payload;
    },
    setCurrentArticle: (state, action: PayloadAction<KnowledgeArticle | null>) => {
      state.currentArticle = action.payload;
    },
    addArticle: (state, action: PayloadAction<KnowledgeArticle>) => {
      state.articles.unshift(action.payload);
    },
    updateArticle: (state, action: PayloadAction<KnowledgeArticle>) => {
      const index = state.articles.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
      if (state.currentArticle?.id === action.payload.id) {
        state.currentArticle = action.payload;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  setLoading,
  setArticles,
  setCurrentArticle,
  addArticle,
  updateArticle,
  setSearchQuery,
  setSelectedCategory,
} = knowledgeSlice.actions;

export default knowledgeSlice.reducer;
