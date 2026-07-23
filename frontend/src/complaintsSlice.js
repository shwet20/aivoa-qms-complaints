import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const sendChatMessage = createAsyncThunk(
  'complaints/sendChat',
  async ({ prompt, actionType, currentFormData }) => {
    const res = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        action_type: actionType,
        current_form_data: currentFormData,
      }),
    });
    return res.json();
  }
);

export const uploadDocument = createAsyncThunk(
  'complaints/uploadDoc',
  async ({ file, currentFormData }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (currentFormData) {
      formData.append('current_form_data', JSON.stringify(currentFormData));
    }
    const res = await fetch('http://localhost:8000/api/extract-document', {
      method: 'POST',
      body: formData,
    });
    return res.json();
  }
);

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    formData: {
      customer_name: '',
      product_name: '',
      product_strength: '',
      batch_number: '',
      mfg_date: '',
      exp_date: '',
      affected_quantity: '',
      complaint_description: '',
      risk_assessment: {
        severity: '',
        risk_score: '',
        next_action: '',
        qa_recommendation: '',
      },
    },
    messages: [
      { sender: 'ai', text: 'Hello! I am your AIVOA Co-pilot. Type a complaint details or upload a PDF/email document to automatically populate the form.' }
    ],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    const handleFulfilled = (state, action) => {
      state.loading = false;
      const data = action.payload;
      
      // Sync Left Form State
      state.formData = {
        customer_name: data.customer_name || state.formData.customer_name,
        product_name: data.product_name || state.formData.product_name,
        product_strength: data.product_strength || state.formData.product_strength,
        batch_number: data.batch_number || state.formData.batch_number,
        mfg_date: data.mfg_date || state.formData.mfg_date,
        exp_date: data.exp_date || state.formData.exp_date,
        affected_quantity: data.affected_quantity || state.formData.affected_quantity,
        complaint_description: data.complaint_description || state.formData.complaint_description,
        risk_assessment: data.risk_assessment || state.formData.risk_assessment,
      };

      // Add AI response to Chat
      state.messages.push({
        sender: 'ai',
        text: data.chat_response || 'Updated the complaint form and risk assessment successfully.',
      });
    };

    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.loading = true;
        state.messages.push({ sender: 'user', text: action.meta.arg.prompt });
      })
      .addCase(sendChatMessage.fulfilled, handleFulfilled)
      .addCase(uploadDocument.pending, (state, action) => {
        state.loading = true;
        state.messages.push({ sender: 'user', text: `Uploaded Document: ${action.meta.arg.file.name}` });
      })
      .addCase(uploadDocument.fulfilled, handleFulfilled);
  },
});

export default complaintsSlice.reducer;