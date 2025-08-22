
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../util/axiosInstance';

// --- Async Thunks ---

// Create a new subscription
export const createSubscribe = createAsyncThunk(
  'subscribe/createSubscribe',
  async (subscribeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post(
        'http://localhost:5000/api/subscribe',
        subscribeData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get all subscriptions
export const getAllSubscribes = createAsyncThunk(
  'subscribe/getAllSubscribes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get('http://localhost:5000/api/subscribe', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get subscription by ID
export const getSubscribeById = createAsyncThunk(
  'subscribe/getSubscribeById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(`http://localhost:5000/api/subscribe/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete subscription by ID
export const deleteSubscribe = createAsyncThunk(
  'subscribe/deleteSubscribe',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.delete(`http://localhost:5000/api/subscribe/${id}`, config);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Slice ---

const subscribeSlice = createSlice({
  name: 'subscribe',
  initialState: {
    subscriptions: [],
    subscription: null,
    loading: false,
    error: null,
    success: false,
    message: '',
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // createSubscribe
      .addCase(createSubscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscribe.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Subscription created successfully';
        state.subscriptions.push(action.payload.data);
      })
      .addCase(createSubscribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllSubscribes
      .addCase(getAllSubscribes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubscribes.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.data || [];
      })
      .addCase(getAllSubscribes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getSubscribeById
      .addCase(getSubscribeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscribeById.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.data || null;
      })
      .addCase(getSubscribeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteSubscribe
      .addCase(deleteSubscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscribe.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Subscription deleted successfully';
        state.subscriptions = state.subscriptions.filter(
          (sub) => sub._id !== action.payload.id
        );
      })
      .addCase(deleteSubscribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = subscribeSlice.actions;
export default subscribeSlice.reducer;
