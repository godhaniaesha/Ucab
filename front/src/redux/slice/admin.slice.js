import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// 🔹 Fetch all passengers
export const fetchPassengers = createAsyncThunk(
  "admin/fetchPassengers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/passengers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; // expecting array of passengers
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch passengers"
      );
    }
  }
);

// 🔹 Fetch all drivers
export const fetchDrivers = createAsyncThunk(
  "admin/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; // expecting array of drivers
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch drivers"
      );
    }
  }
);

// 🔹 Fetch admin statistics
export const getAdminStats = createAsyncThunk(
  "admin/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/getAdminStats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch admin statistics"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    passengers: [],
    drivers: [],
    loading: false,
    error: null,
    stats: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // 🔹 Passengers
    builder
      .addCase(fetchPassengers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassengers.fulfilled, (state, action) => {
        state.loading = false;
        state.passengers = action.payload || [];
      })
      .addCase(fetchPassengers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔹 Drivers
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload || [];
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔹 Admin Stats
    builder
      .addCase(getAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
