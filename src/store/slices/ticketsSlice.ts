
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

// Sample tickets with Somali requestor names
const sampleTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Email not working - cannot send or receive messages',
    description: 'I am unable to send or receive emails since yesterday. The system shows connection error.',
    category: 'email',
    priority: 'high',
    status: 'open',
    requesterId: '7',
    requesterName: 'Farah Hassan',
    requesterDepartment: 'Finance and Economic Planning',
    requesterOffice: 'Room 205, Main Block',
    assignedTechnicianId: '3',
    assignedTechnicianName: 'Xirey Salat',
    comments: [],
    createdAt: '2024-12-01T08:30:00Z',
    updatedAt: '2024-12-01T08:30:00Z',
  },
  {
    id: 'TKT-002',
    title: 'Computer running very slowly',
    description: 'My computer takes a very long time to start up and open programs. It has been getting worse over the past week.',
    category: 'hardware',
    priority: 'medium',
    status: 'in_progress',
    requesterId: '8',
    requesterName: 'Ahmed Ali',
    requesterDepartment: 'Health Services',
    requesterOffice: 'Health Department, Ground Floor',
    assignedTechnicianId: '4',
    assignedTechnicianName: 'Yussuf Abdullahi',
    comments: [
      {
        id: 'comment-1',
        ticketId: 'TKT-002',
        authorId: '4',
        authorName: 'Yussuf Abdullahi',
        content: 'I will check the computer this afternoon and run diagnostics.',
        isInternal: false,
        createdAt: '2024-12-01T10:15:00Z',
      }
    ],
    createdAt: '2024-12-01T09:15:00Z',
    updatedAt: '2024-12-01T10:15:00Z',
  },
  {
    id: 'TKT-003',
    title: 'Cannot connect to office printer',
    description: 'The network printer in our office is not responding. Error message says "printer not found".',
    category: 'network',
    priority: 'medium',
    status: 'resolved',
    requesterId: '9',
    requesterName: 'Maryan Ibrahim',
    requesterDepartment: 'Education and ICT',
    requesterOffice: 'Education Block, Room 101',
    assignedTechnicianId: '6',
    assignedTechnicianName: 'Mohamed Abdisalaam',
    comments: [
      {
        id: 'comment-2',
        ticketId: 'TKT-003',
        authorId: '6',
        authorName: 'Mohamed Abdisalaam',
        content: 'Printer driver was outdated. Updated driver and tested - working normally now.',
        isInternal: false,
        createdAt: '2024-11-30T14:30:00Z',
      }
    ],
    createdAt: '2024-11-30T11:00:00Z',
    updatedAt: '2024-11-30T14:30:00Z',
    resolvedAt: '2024-11-30T14:30:00Z',
  },
  {
    id: 'TKT-004',
    title: 'Phone extension not working',
    description: 'My desk phone is not working. No dial tone and cannot receive calls.',
    category: 'phone',
    priority: 'high',
    status: 'open',
    requesterId: '10',
    requesterName: 'Omar Mohamed',
    requesterDepartment: 'Agriculture and Livestock Development',
    requesterOffice: 'Agriculture Wing, Room 302',
    comments: [],
    createdAt: '2024-12-01T07:45:00Z',
    updatedAt: '2024-12-01T07:45:00Z',
  },
  {
    id: 'TKT-005',
    title: 'Software installation request - Microsoft Excel',
    description: 'I need Microsoft Excel installed on my computer for financial reporting work.',
    category: 'software',
    priority: 'low',
    status: 'open',
    requesterId: '11',
    requesterName: 'Sahra Abdi',
    requesterDepartment: 'Youth, Gender and Social Services',
    requesterOffice: 'Social Services Building, Room 150',
    comments: [],
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
  }
];

const initialState: TicketsState = {
  tickets: sampleTickets,
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
