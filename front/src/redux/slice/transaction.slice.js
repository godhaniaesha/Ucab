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
      console.log(res.data, "Fetched Transactions");

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

        if (action.payload?.role === "superadmin") {
          // superadmin response handle karo
          const txns = action.payload?.transactions || [];
          state.payouts = txns;

          // 🔹 Totals calculate karo
          let totalReceived = 0;
          let totalPlatformFee = 0;
          let driverTotal = 0;
          let driverBookings = 0;
          let passengers = new Set();

          txns.forEach((txn) => {
            const fare = txn.booking?.fare ?? 0;
            const platformFee = txn.platformFee ?? (fare * 0.2); // fallback 20%
            const driverEarning = fare - platformFee;

            totalReceived += fare * 0.2; // 80% to drivers
            totalPlatformFee += platformFee;
            driverTotal += driverEarning;
            if (fare > 0) driverBookings++;

            if (txn.booking?.passenger?._id) {
              passengers.add(txn.booking.passenger._id);
            }
          });

          state.totals = {
            totalReceived,
            totalPlatformFee,
            driverOwner: {
              totalAmount: driverTotal,
              totalBookings: driverBookings,
            },
          };

          state.stats = {
            totalPassengers: passengers.size,
            totalTransactions: txns.length,
          };

          state.passengerPayments = [];
        }
         else {
          // driver / passenger response
          state.payouts = action.payload?.payouts || [];
          state.passengerPayments = action.payload?.passengerPayments || [];
          state.totals = action.payload?.totals || null;
          state.stats = action.payload?.stats || null;
        }
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
