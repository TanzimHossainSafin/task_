import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch courses with filters
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const { data } = await api.get(`/courses?${params.toString()}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

// Fetch single course
export const fetchCourse = createAsyncThunk(
  'courses/fetchCourse',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

// Create course (Admin)
export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/courses', courseData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);

// Update course (Admin)
export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/courses/${id}`, courseData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

// Delete course (Admin)
export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/courses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    currentCourse: null,
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Course
      .addCase(fetchCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
      })
      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course._id !== action.payload);
      });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
