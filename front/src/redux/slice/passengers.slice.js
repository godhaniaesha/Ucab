import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk for booking
export const createBooking = createAsyncThunk(
  'passengers/createBooking',
  async (bookingData) => {
    try {
        const token = localStorage.getItem('token');
        console.log(token,'booking');        
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post('http://localhost:5000/api/passenger/booking', bookingData, config);
      console.log(response,'booking');
      
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Add this new thunk
export const getBookings = createAsyncThunk(
  'passengers/getBookings',
  async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get('http://localhost:5000/api/passenger/bookings', config);
      console.log(response.data,'booking');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Add getTodayStats thunk
export const getTodayStats = createAsyncThunk(
  'passengers/getTodayStats',
  async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get('http://localhost:5000/api/passenger/getTodayStats', config);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Add getTripHistory thunk
export const getTripHistory = createAsyncThunk(
  'passengers/getTripHistory',
  async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get('http://localhost:5000/api/passenger/bookings', config);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const passengersSlice = createSlice({
  name: 'passengers',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    success: false,
    todayStats: null,
    tripHistory: []
  },
  reducers: {
    resetBookingStatus: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getTodayStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodayStats.fulfilled, (state, action) => {
        state.loading = false;
        state.todayStats = action.payload;
      })
      .addCase(getTodayStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getTripHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTripHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.tripHistory = action.payload;
      })
      .addCase(getTripHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { resetBookingStatus } = passengersSlice.actions;
export default passengersSlice.reducer;
