import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk for fetching vehicles
export const getVehicles = createAsyncThunk(
    'vehicles/getVehicles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicle');
            console.log("getVehicles",response);
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const vehiclesSlice = createSlice({
    name: 'vehicles',
    initialState: {
        vehicles: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVehicles.fulfilled, (state, action) => {
                console.log("getVehicles.fulfilled",action.payload);
                state.loading = false;
                state.vehicles = action.payload;
            })
            .addCase(getVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch vehicles';
            });
    }
});

export default vehiclesSlice.reducer;