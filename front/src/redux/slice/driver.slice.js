import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 
// Helper to get auth config
const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};
 
// API base URL
const API_URL = 'http://localhost:5000/api/driver';
 
 
// Thunks for async actions
export const updateLocation = createAsyncThunk(
    'driver/updateLocation',
    async (data, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_URL}/location`, data, config);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error updating location');
        }
    }
);
 
// Check new requests
export const checkNewRequests = createAsyncThunk(
    'driver/checkNewRequests',
    async (_, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.get(`${API_URL}/checkNewRequests`, config);
            return res.data.bookings;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error checking new requests');
        }
    }
);
 
export const getActiveBooking = createAsyncThunk(
    'driver/getActiveBooking',
    async (_, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.get(`${API_URL}/active-booking`, config);
            return res.data.booking;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error fetching active booking');
        }
    }
);
 
export const setAvailability = createAsyncThunk(
    'driver/setAvailability',
    async (data, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_URL}/set-availability`, data, config);
            return res.data.driver;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error setting availability');
        }
    }
);
 
export const acceptBooking = createAsyncThunk(
    'driver/acceptBooking',
    async (id, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_URL}/accept/${id}`, {}, config);
            return res.data.booking;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error accepting booking');
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'driver/cancelBooking',
    async (id, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_URL}/cancel/${id}`, {}, config);
            return res.data.booking;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error canceling booking');
        }
    }
);
 
export const startTrip = createAsyncThunk(
    'driver/startTrip',
    async ({ id, coordinates }, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_URL}/start-trip/${id}`, { coordinates }, config);
            return res.data.booking;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error starting trip');
        }
    }
);
 
export const completeBooking = createAsyncThunk(
    'driver/completeBooking',
    async ({ id, coordinates }, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_URL}/complete/${id}`, { coordinates }, config);
            return res.data.booking;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error completing booking');
        }
    }
);
 
export const getHistory = createAsyncThunk(
    'driver/getHistory',
    async (_, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.get(`${API_URL}/history`, config);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error fetching history');
        }
    }
);
 
export const updateProfile = createAsyncThunk(
    'driver/updateProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_URL}/update-profile`, formData, config);
            return res.data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error updating profile');
        }
    }
);
 
export const getDriverStats = createAsyncThunk(
    'driver/getDriverStats',
    async (_, { rejectWithValue }) => {
        try {
            const config = getAuthConfig();
            const res = await axios.get(`${API_URL}/getDriverStats`, config);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error fetching stats');
        }
    }
);
 
 
 
// Slice
const driverSlice = createSlice({
    name: 'driver',
    initialState: {
        driver: null,
        booking: null,
        bookings: [],
        history: [],
        newRequests:[],
        currentTrip:[],
        stats: {},
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearDriverError(state) {
            state.error = null;
        },
        clearDriverSuccess(state) {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // updateLocation
            .addCase(updateLocation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateLocation.fulfilled, (state, action) => { state.loading = false; state.driver = action.payload.driver; state.success = true; })
            .addCase(updateLocation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // getActiveBooking
            .addCase(getActiveBooking.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getActiveBooking.fulfilled, (state, action) => { state.loading = false; state.currentTrip = action.payload; })
            .addCase(getActiveBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // setAvailability
            .addCase(setAvailability.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(setAvailability.fulfilled, (state, action) => { state.loading = false; state.driver = action.payload; state.success = true; })
            .addCase(setAvailability.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // acceptBooking
            .addCase(acceptBooking.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(acceptBooking.fulfilled, (state, action) => { state.loading = false; state.booking = action.payload; state.success = true; })
            .addCase(acceptBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // cancelBooking
            .addCase(cancelBooking.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(cancelBooking.fulfilled, (state, action) => { state.loading = false; state.booking = action.payload; state.success = true; })
            .addCase(cancelBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // startTrip
            .addCase(startTrip.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(startTrip.fulfilled, (state, action) => { state.loading = false; state.booking = action.payload; state.success = true; })
            .addCase(startTrip.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // completeBooking
            .addCase(completeBooking.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(completeBooking.fulfilled, (state, action) => { state.loading = false; state.booking = action.payload; state.success = true; })
            .addCase(completeBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // getHistory
            .addCase(getHistory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getHistory.fulfilled, (state, action) => { state.loading = false; state.history = action.payload; })
            .addCase(getHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // updateProfile
            .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.driver = action.payload; state.success = true; })
            .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // getDriverStats
            .addCase(getDriverStats.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getDriverStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
            .addCase(getDriverStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
 
            // checkNewRequests
            .addCase(checkNewRequests.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(checkNewRequests.fulfilled, (state, action) => { state.loading = false; state.newRequests = action.payload; })
            .addCase(checkNewRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});
 
export const { clearDriverError, clearDriverSuccess } = driverSlice.actions;
export default driverSlice.reducer;
