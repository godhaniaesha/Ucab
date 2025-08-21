import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/transaction";

// 🔹 Async thunk to fetch transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState(); // 🔹 get auth state (where token is stored)
      const token = localStorage.getItem("token"); // adjust according to your auth slice

      const res = await axios.get(`${API_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; // full object (payouts, passengerPayments, totals, stats)
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    payouts: [],
    passengerPayments: [],
    totals: null,
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload?.payouts || [];
        state.passengerPayments = action.payload?.passengerPayments || [];
        state.totals = action.payload?.totals || null;
        state.stats = action.payload?.stats || null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
