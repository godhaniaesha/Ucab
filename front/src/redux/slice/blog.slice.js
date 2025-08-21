import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Blog async thunk
export const createBlog = createAsyncThunk(
    'blog/createBlog',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/blog/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || error.message);
        }
    }
);

// Get All Blogs
export const getAllBlogs = createAsyncThunk(
    "blog/getAllBlogs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:5000/api/blog/all");
            return response.data; // API should return array of blogs
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || error.message);
        }
    }
);


const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        loading: false,
        error: null,
        success: false,
        blog: null,
    },
    reducers: {
        clearBlogState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.blog = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.blog = action.payload.data;
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // get all blogs
            .addCase(getAllBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload.data || action.payload;
            })
            .addCase(getAllBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBlogState } = blogSlice.actions;
export default blogSlice.reducer;
