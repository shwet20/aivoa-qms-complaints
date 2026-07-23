import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, uploadDocument } from './complaintsSlice';
import { Send, Paperclip, Bot, ShieldAlert, CheckCircle, FileCheck, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();
  const { formData, messages, loading } = useSelector((state) => state.complaints);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Auto-detect if it's an edit or new log
    const isEdit = formData.product_name && (inputText.toLowerCase().includes('sorry') || inputText.toLowerCase().includes('batch'));
    
    dispatch(sendChatMessage({
      prompt: inputText,
      actionType: isEdit ? 'edit' : 'log',
      currentFormData: formData
    }));
    
    setInputText('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadDocument({ file, currentFormData: formData }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white font-bold text-lg px-2.5 py-1 rounded-md">AIVOA</div>
          <span className="text-slate-300 font-medium text-sm">Customer Complaint Management System</span>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Co-pilot Active (Groq + LangGraph)
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 max-w-[1700px] w-full mx-auto">
        
        {/* LEFT FORM: Read-only / Auto-populated by AI */}
        <div className="col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" /> Log Customer Complaint Form
            </h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              Read-Only (Auto-filled by AI)
            </span>
          </div>

          {/* Customer & Product Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Customer Name</label>
              <input type="text" readOnly value={formData.customer_name} placeholder="—" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-800 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Product Name</label>
              <input type="text" readOnly value={formData.product_name} placeholder="—" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-800 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Product Strength / Grade</label>
              <input type="text" readOnly value={formData.product_strength} placeholder="—" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-800 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Batch / Lot Number</label>
              <input type="text" readOnly value={formData.batch_number} placeholder="—" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono font-bold text-blue-700 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Manufacturing Date</label>
              <input type="text" readOnly value={formData.mfg_date} placeholder="—" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-800 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Expiry Date</label>
              <input type="text" readOnly value={formData.exp_date} placeholder="—" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-800 outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Affected Quantity</label>
            <input type="text" readOnly value={formData.affected_quantity} placeholder="—" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-800 outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Complaint Description</label>
            <textarea readOnly value={formData.complaint_description} placeholder="—" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 outline-none resize-none" />
          </div>

          {/* AI Co-Pilot Risk Assessment Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 space-y-3 shadow-md border border-slate-700">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> AI Co-Pilot Risk Assessment
            </h3>
            
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Severity Level</span>
                <span className={`text-base font-bold ${
                  formData.risk_assessment.severity === 'Critical' ? 'text-red-400' :
                  formData.risk_assessment.severity === 'Major' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {formData.risk_assessment.severity || '—'}
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Suggested Next Action</span>
                <span className="text-xs font-semibold text-slate-200 block mt-0.5">
                  {formData.risk_assessment.next_action || '—'}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">QA Recommendation</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {formData.risk_assessment.qa_recommendation || 'Provide complaint input to compute risk assessment.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CHAT: AIVOA Co-Pilot AI Assistant */}
        <div className="col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[780px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">AIVOA Co-pilot</h3>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online & Listening
                </span>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex gap-1.5">
              <label className="cursor-pointer text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium transition shadow-xs">
                <Paperclip className="w-3.5 h-3.5 text-slate-500" /> Document PDF
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  Analyzing input & updating form...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white rounded-b-xl">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell Co-pilot e.g. 'Apollo Pharmacy reported discolored capsules in Amoxicillin 500mg'..."
              className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}