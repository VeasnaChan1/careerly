import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered, 
  Undo, 
  Redo,
  Sparkles,
  Loader2,
  CheckCheck
} from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';
import AiRewriteModal from './AiRewriteModal';
import GrammarCheckModal from './GrammarCheckModal';
import { 
  getCachedAiSuggestions, 
  setCachedAiSuggestions,
  getCachedGrammar,
  setCachedGrammar
} from '../utils/aiCache';

const RichTextEditor = ({ value, onChange, placeholder, onGrammarCheck }) => {
  const { token } = useSelector((state) => state.auth || {});

  // Rewrite state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [originalForModal, setOriginalForModal] = useState('');

  // Grammar check state (CAR-9, CAR-13)
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [isGrammarLoading, setIsGrammarLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState(null);
  const [originalForGrammar, setOriginalForGrammar] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[150px] text-sm text-gray-800',
        spellcheck: 'true',
        lang: 'en',
        autocorrect: 'on',
        autocapitalize: 'sentences',
      },
    },
  });

  // Sync value if updated externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  // Rewrite with AI Handler
  const handleRewriteClick = async () => {
    const rawText = editor.getText().trim();
    if (!rawText) {
      toast.error('Please type some text first before rewriting with AI');
      return;
    }

    setOriginalForModal(rawText);
    const context = placeholder || 'resume content';

    // 1. Check frontend cache first - 0 requests consumed!
    const cached = getCachedAiSuggestions(rawText, context);
    if (cached) {
      setSuggestions(cached);
      setIsLoading(false);
      setIsModalOpen(true);
      return;
    }

    // 2. Call backend API
    setIsModalOpen(true);
    setIsLoading(true);
    setSuggestions([]);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await api.post(
        '/api/ai/rewrite',
        { 
          text: rawText, 
          context 
        },
        { headers }
      );

      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        setSuggestions(data.data);
        setCachedAiSuggestions(rawText, context, data.data);
      } else {
        toast.error('Could not generate suggestions. Please try again.');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('AI Rewrite Error:', error);
      toast.error(error?.response?.data?.message || error.message || 'AI Rewrite failed. Please check your network.');
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Grammar & Spell Check Handler (CAR-9, CAR-13)
  const handleGrammarClick = async () => {
    const rawText = editor.getText().trim();
    if (!rawText) {
      toast.error('Please type some text first to check grammar and spelling');
      return;
    }

    if (onGrammarCheck) {
      onGrammarCheck(rawText);
      return;
    }

    setOriginalForGrammar(rawText);

    // 1. Check frontend cache first - 0 requests consumed!
    const cached = getCachedGrammar(rawText);
    if (cached) {
      setGrammarResult(cached);
      setIsGrammarLoading(false);
      setIsGrammarModalOpen(true);
      return;
    }

    // 2. Call backend API
    setIsGrammarModalOpen(true);
    setIsGrammarLoading(true);
    setGrammarResult(null);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await api.post(
        '/api/ai/grammar-check',
        { text: rawText },
        { headers }
      );

      if (data && data.success && data.data) {
        setGrammarResult(data.data);
        setCachedGrammar(rawText, data.data);
      } else {
        toast.error('Could not verify grammar. Please try again.');
        setIsGrammarModalOpen(false);
      }
    } catch (error) {
      console.error('AI Grammar Check Error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Grammar check failed. Please check your network.');
      setIsGrammarModalOpen(false);
    } finally {
      setIsGrammarLoading(false);
    }
  };

  const handleAcceptSuggestion = (newText) => {
    editor.commands.setContent(newText);
    onChange(editor.getHTML());
    toast.success('Applied AI suggestion!');
  };

  const handleApplyGrammar = (newText) => {
    editor.commands.setContent(newText);
    onChange(editor.getHTML());
    toast.success('Grammar corrections applied!');
  };

  return (
    <>
      <div className="w-full border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('underline') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
            }`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>

          <div className="w-[1px] h-4 bg-gray-300 mx-0.5" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <div className="w-[1px] h-4 bg-gray-300 mx-0.5" />

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <Undo size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <Redo size={16} />
          </button>

          <div className="flex-grow" />

          {/* Action Group: Grammar Check & Rewrite with AI */}
          <div className="flex items-center gap-2">
            {/* Check Grammar with AI Button (CAR-9, CAR-13) */}
            <button
              type="button"
              disabled={isGrammarLoading}
              onClick={handleGrammarClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-300 hover:border-gray-400 rounded-lg shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              title="Check Grammar & Spelling with AI"
            >
              {isGrammarLoading ? (
                <Loader2 className="size-3.5 animate-spin text-emerald-600" />
              ) : (
                <CheckCheck className="size-3.5 text-emerald-600" />
              )}
              <span>{isGrammarLoading ? 'Checking...' : 'Check Grammar'}</span>
            </button>

            {/* Rewrite with AI Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleRewriteClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-white hover:bg-purple-50/60 active:bg-purple-100/60 border border-purple-200 hover:border-purple-300 rounded-lg shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              title="Rewrite with AI"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin text-purple-600" />
              ) : (
                <Sparkles className="size-3.5 text-purple-600" />
              )}
              <span>{isLoading ? 'Rewriting...' : 'Rewrite with AI'}</span>
            </button>
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="relative p-3 bg-white">
          {(!value || value === '<p></p>' || value.replace(/<[^>]*>?/gm, '').trim() === '') && (
            <div 
              onClick={() => editor?.commands.focus()}
              className="absolute top-3.5 left-3.5 right-3.5 text-xs sm:text-sm text-gray-400 select-none pointer-events-none italic leading-relaxed z-10"
            >
              {placeholder || 'Write here...'}
            </div>
          )}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Confirmation & Suggestion Preview Modal for Rewrite */}
      <AiRewriteModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        originalText={originalForModal}
        suggestions={suggestions}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAcceptSuggestion}
      />

      {/* Confirmation & Preview Modal for Grammar Check (CAR-9, CAR-13) */}
      <GrammarCheckModal
        isOpen={isGrammarModalOpen}
        isLoading={isGrammarLoading}
        originalText={originalForGrammar}
        result={grammarResult}
        onClose={() => setIsGrammarModalOpen(false)}
        onApply={handleApplyGrammar}
      />
    </>
  );
};

export default RichTextEditor;
