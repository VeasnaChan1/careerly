import React, { useEffect } from 'react';
import { CheckCheck, CheckCircle2, X, Loader2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const GrammarCheckModal = ({
  isOpen,
  onClose,
  originalText,
  result,
  isLoading,
  onApply
}) => {
  // Lock background body scroll completely while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanOriginal = (originalText || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const correctionsCount = result?.correctionsCount || 0;
  const changes = result?.changes || [];
  const correctedText = result?.correctedText || cleanOriginal;
  const hasNoIssues = !isLoading && (correctionsCount === 0 || cleanOriginal === correctedText);

  const handleApply = () => {
    if (correctedText) {
      onApply(correctedText);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
    >
      <div 
        data-lenis-prevent
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <CheckCheck className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Grammar & Spell Check</h3>
              <p className="text-xs text-gray-500">Review grammar suggestions before applying them</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div 
          data-lenis-prevent
          className="p-6 overflow-y-auto overscroll-contain space-y-5 flex-1 [scrollbar-width:thin]"
          onWheel={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-full">
                <Loader2 className="size-7 text-emerald-600 animate-spin" />
              </div>
              <p className="text-sm font-medium text-gray-700">Checking grammar, punctuation & spelling...</p>
              <p className="text-xs text-gray-400">Verifying sentence structure and vocabulary</p>
            </div>
          ) : hasNoIssues ? (
            /* Acceptance Criterion 3: Text with no issues shows a no-issues message */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-emerald-900">Great job! No issues found.</h4>
                <p className="text-xs sm:text-sm text-emerald-700 max-w-md">
                  Your text is already grammatically clean, correctly spelled, and ready for your CV.
                </p>
              </div>
              <div className="w-full bg-white border border-emerald-200/60 rounded-xl p-3.5 text-left mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Verified Text
                </span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                  "{cleanOriginal}"
                </p>
              </div>
            </div>
          ) : (
            /* Acceptance Criterion 2: Suggested corrections shown before they are applied */
            <div className="space-y-4">
              {/* Correction Count Banner */}
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-semibold text-amber-900">
                    {correctionsCount} {correctionsCount === 1 ? 'correction' : 'corrections'} identified
                  </span>
                </div>
                <span className="text-[11px] text-amber-700 font-medium">Review changes below</span>
              </div>

              {/* List of specific changes made */}
              {changes.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    What was improved:
                  </span>
                  <ul className="space-y-1.5">
                    {changes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-normal">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comparison: Before vs After */}
              <div className="space-y-3">
                {/* Original (Before) */}
                <div className="bg-rose-50/40 border border-rose-200/60 rounded-xl p-3.5 space-y-1 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                    Before
                  </span>
                  <p className="text-xs text-gray-600 line-through leading-relaxed">
                    {cleanOriginal}
                  </p>
                </div>

                {/* Corrected (After) */}
                <div className="bg-emerald-50/50 border border-emerald-300 rounded-xl p-4 space-y-1 text-left ring-2 ring-emerald-100 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Suggested Correction (After)
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Sparkles className="size-3" />
                      Polished
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-900 font-medium leading-relaxed">
                    {correctedText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {hasNoIssues ? 'Close' : 'Discard & Keep Original'}
          </button>

          {!hasNoIssues && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <span>Apply Corrections</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarCheckModal;
