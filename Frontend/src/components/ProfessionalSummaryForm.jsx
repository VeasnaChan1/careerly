import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2, Lightbulb } from 'lucide-react';
import { useSelector } from 'react-redux';
import RichTextEditor from './RichTextEditor';
import AiSummaryModal from './AiSummaryModal';
import api from '../config/api';
import toast from 'react-hot-toast';

const ProfessionalSummaryForm = ({
  data,
  onChange,
  experience = [],
  skills = [],
  profession = '',
  onNavigateSection,
  setResumeData
}) => {
  const { token } = useSelector((state) => state.auth || {});

  // AI Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [dataSources, setDataSources] = useState(null);
  const [missingData, setMissingData] = useState(null);

  // Check if summary is effectively empty ("blank page")
  const isBlankPage =
    !data || data.replace(/<[^>]*>?/gm, '').trim() === '';

  // Extract clean text from existing data
  const rawSummaryText = (data || '').replace(/<[^>]*>?/gm, ' ').trim();

  // Validate entered data
  const checkEnteredData = (roleOverride = '') => {
    const effectivePrompt = (roleOverride || rawSummaryText || profession || '').trim();
    const hasRoleHint = effectivePrompt.length > 0;

    const hasValidExperience = (experience || []).some(
      (exp) =>
        (exp?.position && exp.position.trim().length > 0) ||
        (exp?.company && exp.company.trim().length > 0) ||
        (exp?.description && exp.description.replace(/<[^>]*>?/gm, '').trim().length > 0)
    );

    const validSkills = (skills || [])
      .map((s) => (typeof s === 'string' ? s.trim() : (s?.name || '').trim()))
      .filter((s) => s.length > 0);

    const hasValidSkills = validSkills.length > 0;

    // As requested: If the user wrote a role like "Developer" or has a role hint,
    // AI suggests how to write as hint WITHOUT requiring skill or experience first!
    const hasEnoughData = hasRoleHint || hasValidExperience || hasValidSkills;

    return {
      hasRoleHint,
      hasExperience: hasValidExperience,
      hasSkills: hasValidSkills,
      hasEnoughData,
      effectivePrompt
    };
  };

  const handleGenerateSummary = async (roleOverride = '') => {
    const { hasExperience, hasSkills, hasEnoughData, effectivePrompt } = checkEnteredData(roleOverride);

    // If user has literally entered NOTHING (no role in summary, no profession, no experience, no skills):
    if (!hasEnoughData) {
      setMissingData({
        isMissing: true,
        hasExperience,
        hasSkills
      });
      setSuggestion('');
      setIsModalOpen(true);
      return;
    }

    // We have a role hint (e.g. "Developer") or experience or skills!
    setMissingData({
      isMissing: false,
      hasExperience,
      hasSkills
    });
    setIsLoading(true);
    setIsModalOpen(true);
    setSuggestion('');
    setDataSources(null);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.post(
        '/api/ai/suggest-summary',
        {
          experience,
          skills,
          profession: profession || '',
          currentSummary: roleOverride || data || ''
        },
        { headers }
      );

      if (res.data?.success && res.data?.summary) {
        setSuggestion(res.data.summary);
        setDataSources(res.data.dataSources || null);
      } else {
        toast.error('Could not generate summary suggestion');
        setIsModalOpen(false);
      }
    } catch (error) {
      const respData = error?.response?.data;
      if (respData?.missingFields) {
        setMissingData({
          isMissing: true,
          hasExperience,
          hasSkills
        });
      } else {
        toast.error(respData?.message || error.message || 'Failed to generate summary');
        setIsModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleClick = (roleName) => {
    handleGenerateSummary(roleName);
  };

  const handleAcceptSuggestion = (formattedHtml) => {
    onChange(formattedHtml);
    if (setResumeData) {
      setResumeData((prev) => ({
        ...prev,
        professional_summary: formattedHtml
      }));
    }
    toast.success('Professional summary applied to your CV!');
  };

  const handleDiscardSuggestion = () => {
    toast('Suggestion discarded — keeping your current summary.', {
      icon: 'ℹ️'
    });
  };

  const quickRoles = [
    'Developer',
    'Frontend Developer',
    'UI/UX Designer',
    'Marketing Specialist',
    'Project Manager',
    'Data Analyst'
  ];

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Summarize your core strengths and career goals
          </p>
        </div>

        {/* Top-right AI Action Button */}
        <button
          type="button"
          onClick={() => handleGenerateSummary()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#F46200] bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200/80 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
          title="Suggest summary with AI"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin text-[#F46200]" />
          ) : (
            <Sparkles className="size-3.5 text-[#F46200]" />
          )}
          <span>Suggest with AI</span>
        </button>
      </div>

      {/* "Don't Start from a Blank Page" Callout Banner (shown if summary is empty) */}
      {isBlankPage && (
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/40 border border-[#FAD7C0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#F46200] text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <Wand2 className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#2D2D2D] text-sm sm:text-base flex items-center gap-2">
                Don't start from a blank page!
              </h4>
              <p className="text-xs text-[#5A554E] mt-0.5 leading-relaxed max-w-lg">
                Type your role (e.g. <strong>"Developer"</strong>) below or click one of the quick roles, then let AI craft a complete draft you can edit or accept.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleGenerateSummary()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.98] transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>Suggest Summary with AI</span>
          </button>
        </div>
      )}

      {/* Quick Role Hint Pills Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5A554E] bg-white border border-[#E7E2D8] rounded-xl px-3.5 py-2 shadow-2xs">
        <span className="font-semibold text-gray-700 flex items-center gap-1">
          <Lightbulb className="size-3.5 text-amber-500 shrink-0" />
          <span>Quick hints:</span>
        </span>
        <span className="text-[11px] text-gray-500 mr-1">
          Type or click a role to draft:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {quickRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleQuickRoleClick(role)}
              className="px-2.5 py-0.5 rounded-full bg-gray-50 hover:bg-orange-50 hover:text-[#F46200] hover:border-orange-300 border border-gray-200 text-[11px] font-medium text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              + {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Rich Text Editor with explicit placeholder hint */}
      <div className="space-y-2">
        <RichTextEditor
          value={data || ''}
          onChange={onChange}
          placeholder="Hint: Type your target role (e.g. 'Developer') and click 'Suggest with AI' to draft a tailored summary, or write your own..."
        />
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <p>
            Tip: Keep it concise (2-3 sentences) focusing on relevant strengths and career goals.
          </p>
          {!isBlankPage && (
            <button
              type="button"
              onClick={() => handleGenerateSummary()}
              className="text-[#F46200] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="size-3" />
              <span>Regenerate with AI</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Summary Review Modal (Accept, Edit, or Discard) */}
      <AiSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isLoading}
        suggestion={suggestion}
        dataSources={dataSources}
        missingData={missingData}
        onAccept={handleAcceptSuggestion}
        onDiscard={handleDiscardSuggestion}
        onRegenerate={(overrideRole) => handleGenerateSummary(overrideRole || '')}
        onNavigateSection={onNavigateSection}
      />
    </div>
  );
};

export default ProfessionalSummaryForm;
