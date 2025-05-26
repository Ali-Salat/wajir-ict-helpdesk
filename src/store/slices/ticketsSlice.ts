
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket, TicketStats } from '../../types';

interface TicketsState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  stats: TicketStats | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string[];
    category: string[];
    priority: string[];
    assignedTo: string;
    dateRange: { start: string; end: string } | null;
  };
}

const initialState: TicketsState = {
  tickets: [],
  currentTicket: null,
  stats: null,
  isLoading: false,
  error: null,
  filters: {
    status: [],
    category: [],
    priority: [],
    assignedTo: '',
    dateRange: null,
  },
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.unshift(action.payload);
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket = action.payload;
      }
    },
    setCurrentTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.currentTicket = action.payload;
    },
    setStats: (state, action: PayloadAction<TicketStats>) => {
      state.stats = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TicketsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setTickets,
  addTicket,
  updateTicket,
  setCurrentTicket,
  setStats,
  setFilters,
  setError,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
