import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import complaintsReducer from './complaintsSlice';

export const store = configureStore({
  reducer: {
    complaints: complaintsReducer,
  },
});

export const fetchComplaints = createAsyncThunk('complaints/fetchAll', async () => {
  const res = await fetch('http://localhost:8000/api/complaints');
  return res.json();
});

export const submitComplaint = createAsyncThunk('complaints/submit', async (rawText) => {
  const res = await fetch('http://localhost:8000/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw_text: rawText }),
  });
  return res.json();
});

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null
  },
  reducers: {
    selectComplaint: (state, action) => {
      state.selected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.items = action.payload;
        if (!state.selected && action.payload.length > 0) {
          state.selected = action.payload[0];
        }
      })
      .addCase(submitComplaint.pending, (state) => { state.loading = true; })
      .addCase(submitComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.selected = action.payload;
      });
  },
});

export const { selectComplaint } = complaintsSlice.actions;
export default complaintsSlice.reducer;