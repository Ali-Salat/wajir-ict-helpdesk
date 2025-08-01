
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UsersState {
  users: User[];
  technicians: User[];
  isLoading: boolean;
}

// Updated initial state with real system users and Somali names
const initialSystemUsers: User[] = [
  {
    id: '1',
    email: 'ellisalat@gmail.com',
    name: 'Ali Salat',
    role: 'admin',
    department: 'ICT, Trade, Investment and Industry',
    skills: ['System Administration', 'Network Management', 'Database Administration'],
    isActive: true,
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-05-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'mshahid@wajir.go.ke',
    name: 'Mohamed Shahid',
    role: 'admin',
    department: 'ICT, Trade, Investment and Industry',
    skills: ['System Administration', 'Project Management', 'Cybersecurity'],
    isActive: true,
    createdAt: '2025-05-02T00:00:00Z',
    updatedAt: '2025-05-02T00:00:00Z',
  },
  {
    id: '3',
    email: 'xireysalat@gmail.com',
    name: 'Xirey Salat',
    role: 'technician',
    department: 'ICT, Trade, Investment and Industry',
    skills: ['Hardware Troubleshooting', 'Software Installation', 'Network Configuration'],
    isActive: true,
    createdAt: '2025-05-03T00:00:00Z',
    updatedAt: '2025-05-03T00:00:00Z',
  },
  {
    id: '4',
    email: 'yussuf@wajir.go.ke',
    name: 'Yussuf Abdullahi',
    role: 'technician',
    department: 'ICT, Trade, Investment and Industry',
    skills: ['Email Systems', 'Phone Systems', 'Mobile Device Management'],
    isActive: true,
    createdAt: '2025-05-04T00:00:00Z',
    updatedAt: '2025-05-04T00:00:00Z',
  },
  {
    id: '5',
    email: 'abdille@wajir.go.ke',
    name: 'Abdille Osman',
    role: 'approver',
    department: 'ICT, Trade, Investment and Industry',
    skills: ['Team Management', 'Quality Assurance', 'Process Improvement'],
    isActive: true,
    createdAt: '2025-05-05T00:00:00Z',
    updatedAt: '2025-05-05T00:00:00Z',
  },
  {
    id: '6',
    email: 'mabdisalaam@wajir.go.ke',
    name: 'Mohamed Abdisalaam',
    role: 'technician',
    department: 'ICT, Trade, Investment and Industry',
    skills: ['Network Configuration', 'Server Management', 'Backup & Recovery'],
    isActive: true,
    createdAt: '2025-05-06T00:00:00Z',
    updatedAt: '2025-05-06T00:00:00Z',
  },
  // Sample requestors with Somali names
  {
    id: '7',
    email: 'farah.hassan@wajir.go.ke',
    name: 'Farah Hassan',
    role: 'requester',
    department: 'Finance and Economic Planning',
    skills: [],
    isActive: true,
    createdAt: '2025-05-07T00:00:00Z',
    updatedAt: '2025-05-07T00:00:00Z',
  },
  {
    id: '8',
    email: 'ahmed.ali@wajir.go.ke',
    name: 'Ahmed Ali',
    role: 'requester',
    department: 'Health Services',
    skills: [],
    isActive: true,
    createdAt: '2025-05-08T00:00:00Z',
    updatedAt: '2025-05-08T00:00:00Z',
  },
  {
    id: '9',
    email: 'maryan.ibrahim@wajir.go.ke',
    name: 'Maryan Ibrahim',
    role: 'requester',
    department: 'Education, Social Welfare and Family Affairs',
    skills: [],
    isActive: true,
    createdAt: '2025-05-09T00:00:00Z',
    updatedAt: '2025-05-09T00:00:00Z',
  },
  {
    id: '10',
    email: 'omar.mohamed@wajir.go.ke',
    name: 'Omar Mohamed',
    role: 'requester',
    department: 'Agriculture, Livestock and Veterinary Services',
    skills: [],
    isActive: true,
    createdAt: '2025-05-10T00:00:00Z',
    updatedAt: '2025-05-10T00:00:00Z',
  },
  {
    id: '11',
    email: 'sahra.abdi@wajir.go.ke',
    name: 'Sahra Abdi',
    role: 'requester',
    department: 'Water Services',
    skills: [],
    isActive: true,
    createdAt: '2025-05-11T00:00:00Z',
    updatedAt: '2025-05-11T00:00:00Z',
  },
  {
    id: '12',
    email: 'hassan.omar@wajir.go.ke',
    name: 'Hassan Omar',
    role: 'requester',
    department: 'Roads and Transport',
    skills: [],
    isActive: true,
    createdAt: '2025-05-12T00:00:00Z',
    updatedAt: '2025-05-12T00:00:00Z',
  }
];

const initialState: UsersState = {
  users: initialSystemUsers,
  technicians: initialSystemUsers.filter(user => user.role === 'technician'),
  isLoading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.technicians = action.payload.filter(user => user.role === 'technician');
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      if (action.payload.role === 'technician') {
        state.technicians.push(action.payload);
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      const techIndex = state.technicians.findIndex(u => u.id === action.payload.id);
      if (techIndex !== -1) {
        if (action.payload.role === 'technician') {
          state.technicians[techIndex] = action.payload;
        } else {
          state.technicians.splice(techIndex, 1);
        }
      } else if (action.payload.role === 'technician') {
        state.technicians.push(action.payload);
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.technicians = state.technicians.filter(user => user.id !== action.payload);
    },
  },
});

export const { setLoading, setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
