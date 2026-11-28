import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  X,
  Loader2,
  AlertCircle,
  Briefcase,
  Plus,
  RotateCcw,
  ArrowRight,
  Edit3,
  Lightbulb
} from 'lucide-react';

const AiSummaryModal = ({
  isOpen,
  onClose,
  isLoading,
  suggestion = '',
  dataSources = null,
  missingData = null,
  onAccept,
  onDiscard,
  onRegenerate,
  onNavigateSection
}) => {
  const [editedText, setEditedText] = useState('');
  const [modalRoleInput, setModalRoleInput] = useState('');

  // When a new suggestion is generated, populate the editable text area
  useEffect(() => {
    if (suggestion) {
      // Strip outer HTML tags to provide clean, natural editable text
      const clean = suggestion
        .replace(/<\/p><p>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>?/gm, '')
        .trim();
      setEditedText(clean);
    } else {
      setEditedText('');
    }
  }, [suggestion]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!editedText.trim()) return;

    // Convert plain paragraphs back into clean HTML <p> tags
    const paragraphs = editedText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const formattedHtml =
      paragraphs.length > 0
        ? paragraphs.map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('')
        : `<p>${editedText.trim()}</p>`;

    onAccept(formattedHtml);
    onClose();
  };

  const handleDiscard = () => {
    if (onDiscard) onDiscard();
    onClose();
  };

  const handleRoleSubmit = (e) => {
    if (e) e.preventDefault();
    if (modalRoleInput.trim() && onRegenerate) {
      onRegenerate(modalRoleInput.trim());
    }
  };

  const quickRoles = [
    'Developer',
    'Frontend Developer',
    'UI/UX Designer',
    'Marketing Specialist',
    'Project Manager',
    'Data Analyst'
  ];

  // Word count helper
  const wordCount = editedText.trim()
    ? editedText.trim().split(/\s+/).length
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleDiscard}
    >
      <div
        data-lenis-prevent
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl text-white shadow-2xs ${
                missingData?.isMissing ? 'bg-[#F46200]' : 'bg-[#F46200]'
              }`}
            >
              {missingData?.isMissing ? (
                <Lightbulb className="size-4.5" />
              ) : (
                <Sparkles className="size-4.5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-[#2D2D2D] text-base">
                {missingData?.isMissing
                  ? 'Give AI a Target Role or Hint'
                  : 'AI Suggested Professional Summary'}
              </h3>
              <p className="text-xs text-[#5A554E]">
                {missingData?.isMissing
                  ? 'Type your role (e.g. Developer) or pick a hint below'
                  : dataSources?.roleUsed
                  ? `Tailored for: ${dataSources.roleUsed}`
                  : 'Generated from your target role, experience, and skills'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDiscard}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          data-lenis-prevent
          className="p-6 overflow-y-auto overscroll-contain space-y-5 flex-1 [scrollbar-width:thin]"
        >
          {/* CASE 1: Not enough data -> Give user quick role hints! */}
          {missingData?.isMissing ? (
            <div className="space-y-4 py-1">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50/80 border border-[#FAD7C0] text-xs sm:text-sm text-[#2D2D2D] leading-relaxed">
                <p className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-[#F46200]" />
                  <span>Don't start from a blank page!</span>
                </p>
                <p className="text-[#5A554E] text-xs">
                  You don't need full work history or skills to start. Simply type your desired role like <strong>"Developer"</strong> and AI will suggest how to write a compelling summary as a hint/starting draft!
                </p>
              </div>

              {/* Instant Role Input Form */}
              <form onSubmit={handleRoleSubmit} className="space-y-2">
                <label className="text-xs font-bold text-gray-700">
                  Target Role / Field:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modalRoleInput}
                    onChange={(e) => setModalRoleInput(e.target.value)}
                    placeholder="e.g. Developer, Web Designer, Digital Marketer..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] outline-none transition-all shadow-2xs"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!modalRoleInput.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Generate</span>
                  </button>
                </div>
              </form>

              {/* Quick Role Hint Buttons */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-gray-500">
                  Or select a common role to draft immediately:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => onRegenerate && onRegenerate(role)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-orange-50 hover:text-[#F46200] hover:border-orange-300 border border-gray-200 text-xs font-medium text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      + {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Section Links */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Or add details from other sections:
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {onNavigateSection && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateSection('experience');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="size-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Add Experience</span>
                      </div>
                      <ArrowRight className="size-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}

                  {onNavigateSection && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateSection('skills');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-3.5 text-purple-600" />
                        <span className="text-xs font-medium text-gray-700">Add Skills</span>
                      </div>
                      <ArrowRight className="size-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            /* CASE 2: Loading */
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="p-3.5 bg-orange-50 rounded-2xl">
                <Loader2 className="size-8 text-[#F46200] animate-spin" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Crafting your professional summary suggestion...
              </p>
              <p className="text-xs text-gray-500 max-w-sm">
                AI is generating a tailored draft so you don't start from a blank page. You can review, edit, or accept it next.
              </p>
            </div>
          ) : (
            /* CASE 3: Suggestion ready (User can accept, edit, or discard) */
            <div className="space-y-4">
              {/* Context metadata badge */}
              {dataSources && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-gray-600 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-700">Synthesized for:</span>
                  {dataSources.roleUsed && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-100 text-[#F46200] font-semibold text-[11px]">
                      {dataSources.roleUsed}
                    </span>
                  )}
                  {dataSources.rolesUsed && dataSources.rolesUsed.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium text-[11px]">
                      {dataSources.rolesUsed.slice(0, 2).join(' • ')}
                    </span>
                  )}
                  {dataSources.skillsUsed && dataSources.skillsUsed.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium text-[11px]">
                      {dataSources.skillsUsed.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>
              )}

              {/* Editable Text Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Edit3 className="size-3.5 text-[#F46200]" />
                    <span>Suggested Summary (You can edit below):</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {wordCount} words
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={6}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    placeholder="Your professional summary will appear here..."
                    className="w-full p-4 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] outline-none transition-all leading-relaxed bg-white shadow-2xs resize-y"
                  />
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  💡 Tip: You can edit or refine any words directly in this box before accepting.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0 flex-wrap gap-2">
          {missingData?.isMissing ? (
            <button
              type="button"
              onClick={handleDiscard}
              className="ml-auto px-5 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <>
              {/* Discard button */}
              <button
                type="button"
                onClick={handleDiscard}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <X className="size-3.5" />
                <span>Discard</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Try another button */}
                {onRegenerate && (
                  <button
                    type="button"
                    onClick={() => onRegenerate()}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    title="Generate another variation"
                  >
                    <RotateCcw className="size-3.5 text-gray-500" />
                    <span className="hidden sm:inline">Try Another</span>
                  </button>
                )}

                {/* Accept & Apply button */}
                <button
                  type="button"
                  disabled={isLoading || !editedText.trim()}
                  onClick={handleApply}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] rounded-xl shadow-xs hover:shadow active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Check className="size-3.5" />
                  <span>Accept & Apply to CV</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSummaryModal;
