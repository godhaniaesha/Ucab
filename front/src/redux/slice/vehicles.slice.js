// src/redux/slice/vehicles.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/vehicle";

// ================= Thunks =================

// Add Vehicle
export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(`${API_URL}/add`, formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get All Vehicles
export const getVehicles = createAsyncThunk(
  "vehicles/getVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get Vehicle By ID
export const getVehicleById = createAsyncThunk(
  "vehicles/getVehicleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Vehicle
export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.put(`${API_URL}/${id}`, formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Vehicle
export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(`${API_URL}/${id}`, config);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= Slice =================
const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    vehicle: null, // for single vehicle
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Vehicle
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Vehicle created successfully";
        state.vehicles.push(action.payload.data || action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Vehicles
      .addCase(getVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.data || action.payload;
      })
      .addCase(getVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Vehicle By ID
      .addCase(getVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicle = action.payload.data || action.payload;
      })
      .addCase(getVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Vehicle updated successfully";
        const index = state.vehicles.findIndex((v) => v._id === action.payload.data?._id || action.payload._id);
        if (index !== -1) {
          state.vehicles[index] = action.payload.data || action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Vehicle
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Vehicle deleted successfully";
        state.vehicles = state.vehicles.filter((v) => v._id !== action.payload.id);
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
