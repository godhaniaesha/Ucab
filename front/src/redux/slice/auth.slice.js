import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';
import axios from 'axios';


// Async thunk for user registration (name, email, password, role, phone)
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/register`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/login`, userData);
            localStorage.setItem("token", response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for forgot password (send OTP to phone)
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (phone, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/forgot-password`, { phone });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for OTP verification (phone + otp)
export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/verify-otp`, otpData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for reset password (phone, otp, newPassword, confirmPassword)
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/reset-password`, resetData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch current user profile (GET)
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axiosInstance.get(`/auth/getuser`);
            // console.log("resposne",response);
            
            // console.log("resposne",response.data.data);
           
            
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update current user profile (PUT, with image)
export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (formData, { rejectWithValue }) => {   // 👈 accept FormData directly
      try {
        console.log('fggh',formData);
        
        const token = localStorage.getItem('token');
        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          : {};
  
        // Proper debug log
        console.log("form-data sending:");
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
  
        const response = await axios.post(
          "http://localhost:5000/api/driver/update-profile",
          formData,
          config
        );
  
        return response.data.user; // 👈 make sure backend returns updated user
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

export const getUserById = createAsyncThunk(
    'auth/getUserById',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axiosInstance.get(`/auth/users/${userId}`, config);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        success: false,
        message: '',
        accessToken: null,
        otpSent: false,
        otpVerified: false,
        resetToken: null,
        profile: null,
        profileLoading: false,
        profileError: null,
        profileUpdateSuccess: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
            state.message = '';
        },
        clearOtpStatus: (state) => {
            state.otpSent = false;
            state.otpVerified = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.error = null;
            state.success = false;
            state.message = '';
        },
        clearProfileStatus: (state) => {
            state.profileUpdateSuccess = false;
            state.profileError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Registration successful';
                if (action.payload.data) {
                    state.user = action.payload.data;
                    state.isAuthenticated = true;
                    state.accessToken = action.payload.accessToken;
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Login successful';
                state.user = action.payload.user || action.payload.data;
                state.isAuthenticated = true;
                state.accessToken = action.payload.token || action.payload.accessToken;
                try {
                    if (state.accessToken) {
                        localStorage.setItem('token', state.accessToken);
                    }
                } catch (_) { }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'OTP sent successfully';
                state.otpSent = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'OTP verified successfully';
                state.otpVerified = true;
                state.resetToken = action.payload.resetToken;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Password reset successful';
                state.otpSent = false;
                state.otpVerified = false;
                state.resetToken = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload;
            })
            // Update User Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
                state.profileUpdateSuccess = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profileUpdateSuccess = true;
                // If backend sends updated user, update state
                if (action.payload) {
                  state.profile = action.payload;
                }
              })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload;
                state.profileUpdateSuccess = false;
            })
            // Get User By ID
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.user = action.payload.data;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccess, clearOtpStatus, logout, clearProfileStatus } = authSlice.actions;
export default authSlice.reducer;