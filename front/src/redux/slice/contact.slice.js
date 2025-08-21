import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../util/axiosInstance";

// Create new contact
export const createContact = createAsyncThunk(
  "contact/createContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/contact",
        contactData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get all contacts
export const getAllContacts = createAsyncThunk(
  "contact/getAllContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:5000/api/contact"
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get contact by ID
export const getContactById = createAsyncThunk(
  "contact/getContactById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/api/contact/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update contact
export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async ({ id, contactData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:5000/api/contact/${id}`,
        contactData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete contact
export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:5000/api/contact/${id}`
      );
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contacts: [],
    contact: null,
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
    clearContactSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Contact created successfully";
        if (action.payload.data) {
          state.contacts.push(action.payload.data);
        }
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Contacts
      .addCase(getAllContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || [];
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Contact By ID
      .addCase(getContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload.data;
      })
      .addCase(getContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Contact updated successfully";
        const index = state.contacts.findIndex(
          (c) => c._id === action.payload.data?._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload.data;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Contact deleted successfully";
        state.contacts = state.contacts.filter((c) => c._id !== action.payload.id);
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactError, clearContactSuccess } = contactSlice.actions;
export default contactSlice.reducer;
