import { Loader, Sparkle } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (isGenerating) return;
    try {
      setIsGenerating(true);
      const prompt = `enhance my professional summary "${data || ''}"`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.post(
        '/api/ai/enchance-pro-sum',
        { userContent: prompt },
        { headers }
      );

      if (response.data && response.data.output) {
        setResumeData((prev) => ({ ...prev, professional_summary: response.data.output }));
        onChange(response.data.output);
        toast.success('Summary enhanced with AI!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'AI Enhancement failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Professional Summary</h3>
          <p className="text-sm text-gray-500">Add summary for your resume here</p>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? <Loader className="size-3.5 animate-spin" /> : <Sparkle className="size-3.5" />}
          {isGenerating ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      <div className="mt-6 space-y-2">
        <RichTextEditor
          value={data || ''}
          onChange={onChange}
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />
        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
          Tip: Keep it concise (2-3 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
