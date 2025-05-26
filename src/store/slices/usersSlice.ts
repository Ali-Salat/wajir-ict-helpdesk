
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UsersState {
  users: User[];
  technicians: User[];
  isLoading: boolean;
}

const initialState: UsersState = {
  users: [],
  technicians: [],
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
  },
});

export const { setLoading, setUsers, addUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
