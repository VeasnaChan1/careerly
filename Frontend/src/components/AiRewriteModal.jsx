import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Loader2, ArrowRight } from 'lucide-react';

const AiRewriteModal = ({
  isOpen,
  onClose,
  originalText,
  suggestions = [],
  isLoading,
  onAccept,
  title = "Rewrite with AI"
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  // Clean original text preview (strip HTML tags)
  const cleanOriginal = (originalText || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const handleAccept = () => {
    if (suggestions && suggestions[selectedIndex]) {
      onAccept(suggestions[selectedIndex].text);
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 via-white to-blue-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
              <p className="text-xs text-gray-500">Scroll with mouse to view all suggestions, click to select</p>
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

        {/* Modal Body - Single dedicated scroll container with Lenis prevention */}
        <div 
          data-lenis-prevent
          className="p-6 overflow-y-auto overscroll-contain space-y-5 flex-1 [scrollbar-width:thin]"
          onWheel={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="p-3 bg-purple-50 rounded-full">
                <Loader2 className="size-7 text-purple-600 animate-spin" />
              </div>
              <p className="text-sm font-medium text-gray-700">Gemini AI is crafting suggestions...</p>
              <p className="text-xs text-gray-400">Analyzing keywords, impact verbs, and tone</p>
            </div>
          ) : (
            <>
              {/* Original Text Preview */}
              {cleanOriginal && (
                <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Original Text
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{cleanOriginal}"
                  </p>
                </div>
              )}

              {/* Suggestions List */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>AI Suggestions ({suggestions.length})</span>
                  <span className="text-[11px] font-normal text-purple-600">Click to select</span>
                </div>

                <div className="space-y-3">
                  {suggestions.map((item, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`cursor-pointer rounded-xl p-4 transition-all border text-left relative ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-100 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${
                            item.tone === 'Action-Oriented'
                              ? 'bg-blue-100 text-blue-800'
                              : item.tone === 'Concise'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {item.tone || `Option ${index + 1}`}
                          </span>

                          <div className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="size-3" />}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Discard & Keep Original
          </button>

          <button
            type="button"
            disabled={isLoading || !suggestions.length}
            onClick={handleAccept}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <span>Accept Suggestion</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiRewriteModal;
