import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create async thunk for booking
export const createBooking = createAsyncThunk(
  'passengers/createBooking',
  async (bookingData) => {
    console.log(bookingData, "bookingData");

    try {
      const token = localStorage.getItem('token');
      console.log(token, 'booking');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post('http://localhost:5000/api/passenger/booking', bookingData, config);
      console.log(response.data, 'booking');

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
      console.log(response.data, 'booking');
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
      return response.data.todayStats;
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
// Add this new thunk at the top with other thunks
export const getPendingPayments = createAsyncThunk(
  'passengers/getPendingPayments',
  async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get('http://localhost:5000/api/payment/pending', config);
      console.log(response.data.pendingPayments, 'pendingPayments');
      return response.data.pendingPayments;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching pending payments' };
    }
  }
);
// Pay for a specific ride
export const payPendingPayment = createAsyncThunk(
  'passengers/payPendingPayment',
  async ({ paymentId, method }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post(
        `http://localhost:5000/api/payment/${paymentId}/pay`,
        { method },
        config
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment failed' };
    }
  }
);
// Cancel booking thunk
export const cancelBooking = createAsyncThunk(
  'passengers/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.put(
        `http://localhost:5000/api/passenger/booking/${bookingId}`,
        {}, // agar cancel karva extra data lagse to aa object ma mokli sako
        config
      );
      return response.data; // assume response ma updated booking return thay che
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cancel booking' });
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
    tripHistory: [],
    pendingPayments: [],
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
        state.bookings.push(action.payload);   // 👈 booking add kare che
      })

      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        toast.success('Booking cancelled successfully!');

        // state.bookings ma booking update karo
        state.bookings = state.bookings.map((booking) =>
          booking.id === action.payload.id ? action.payload : booking
        );

        // tripHistory ma bhi update karva hoy to
        state.tripHistory = state.tripHistory.map((trip) =>
          trip.id === action.payload.id ? action.payload : trip
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to cancel booking';
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
      // getPendingPayments
      .addCase(getPendingPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPayments = action.payload; // 👈 new state property
      })
      .addCase(getPendingPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch pending payments';
      })
      .addCase(payPendingPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payPendingPayment.fulfilled, (state, action) => {
        state.loading = false;
        toast.success('Payment successful!');
        // Optionally, remove the paid ride from pendingPayments
        state.pendingPayments = state.pendingPayments.filter(
          (ride) => ride.payment.id !== action.meta.arg.paymentId
        );
      })
      .addCase(payPendingPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Payment failed';
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
