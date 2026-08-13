import React, { useState } from 'react';
import { WheelOption, PresetList, Language } from '../types';
import { PRESET_LISTS } from '../data/presets';
import { t } from '../utils/translations';
import {
  Plus,
  Trash2,
  Shuffle,
  SortAsc,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  ListFilter,
  Wand2,
  Loader2,
  X,
} from 'lucide-react';

interface OptionManagerProps {
  options: WheelOption[];
  setOptions: React.Dispatch<React.SetStateAction<WheelOption[]>>;
  lang: Language;
}

export const OptionManager: React.FC<OptionManagerProps> = ({ options, setOptions, lang }) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'bulk'>('individual');
  const [bulkText, setBulkText] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // AI Prompting state
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Add individual item
  const handleAddOption = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newLabel.trim()) return;

    const newItem: WheelOption = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      label: newLabel.trim(),
      hidden: false,
    };

    setOptions((prev) => [...prev, newItem]);
    setNewLabel('');
  };

  // Bulk update
  const handleApplyBulk = () => {
    const lines = bulkText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newOptions: WheelOption[] = lines.map((line, idx) => ({
      id: Date.now().toString() + '_' + idx,
      label: line,
      hidden: false,
    }));

    setOptions(newOptions);
  };

  // Shuffle list
  const handleShuffle = () => {
    setOptions((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  // Sort A-Z
  const handleSort = () => {
    setOptions((prev) =>
      [...prev].sort((a, b) => a.label.localeCompare(b.label, lang === 'ar' ? 'ar' : 'en'))
    );
  };

  // Toggle Visibility
  const toggleVisibility = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, hidden: !opt.hidden } : opt))
    );
  };

  // Delete option
  const handleDelete = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  // Duplicate option
  const handleDuplicate = (opt: WheelOption) => {
    const copy: WheelOption = {
      ...opt,
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 5),
    };
    setOptions((prev) => [...prev, copy]);
  };

  // Clear all
  const handleClearAll = () => {
    if (confirm(lang === 'ar' ? 'هل أنت تأكد من مسح جميع الخيارات؟' : 'Are you sure you want to clear all options?')) {
      setOptions([]);
      setBulkText('');
    }
  };

  // Load Preset
  const handleLoadPreset = (preset: PresetList) => {
    const newOpts: WheelOption[] = preset.items.map((item, idx) => ({
      id: Date.now().toString() + '_' + idx,
      label: item,
      hidden: false,
    }));
    setOptions(newOpts);
    setBulkText(preset.items.join('\n'));
    setShowPresetsModal(false);
  };

  // Generate with AI (Gemini Endpoint)
  const handleGenerateAi = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setAiError('');

    try {
      const res = await fetch('/api/ai-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          lang,
          count: 10,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate');
      }

      if (Array.isArray(data.options) && data.options.length > 0) {
        const generatedOpts: WheelOption[] = data.options.map((text: string, idx: number) => ({
          id: Date.now().toString() + '_ai_' + idx,
          label: String(text),
          hidden: false,
        }));

        setOptions(generatedOpts);
        setBulkText(data.options.join('\n'));
        setShowAiModal(false);
        setAiTopic('');
      }
    } catch (err: any) {
      setAiError(err?.message || (lang === 'ar' ? 'حدث خطأ أثناء التوليد' : 'Error generating options'));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-xl w-full space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            {lang === 'ar' ? 'إدارة الخيارات' : 'Manage Options'}
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-amber-300 font-semibold border border-slate-600">
            {options.length}
          </span>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'individual'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'بطاقات' : 'Cards'}
          </button>
          <button
            onClick={() => {
              setActiveTab('bulk');
              setBulkText(options.map((o) => o.label).join('\n'));
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'bulk'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'نص جماعي' : 'Bulk Text'}
          </button>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setShowPresetsModal(true)}
          className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-600/60 transition"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="truncate">{lang === 'ar' ? 'قوائم جاهزة' : 'Presets'}</span>
        </button>

        <button
          onClick={() => setShowAiModal(true)}
          className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-800/60 hover:to-indigo-800/60 text-purple-200 rounded-xl text-xs font-semibold border border-purple-500/40 transition"
        >
          <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 shrink-0" />
          <span className="truncate">{lang === 'ar' ? 'ذكاء اصطناعي' : 'AI Generator'}</span>
        </button>

        <button
          onClick={handleShuffle}
          className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-600/60 transition"
        >
          <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
          <span className="truncate">{lang === 'ar' ? 'خلط' : 'Shuffle'}</span>
        </button>

        <button
          onClick={handleSort}
          className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-600/60 transition"
        >
          <SortAsc className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{lang === 'ar' ? 'ترتيب' : 'Sort A-Z'}</span>
        </button>
      </div>

      {/* TAB 1: Individual Cards */}
      {activeTab === 'individual' && (
        <div className="space-y-3">
          {/* Add Form */}
          <form onSubmit={handleAddOption} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={lang === 'ar' ? 'أضف خيار جديد هنا...' : 'Type new option here...'}
              className="flex-1 px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-1 transition shadow-lg shadow-amber-500/10 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
            </button>
          </form>

          {/* List of Cards */}
          <div className="max-h-[280px] sm:max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {options.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                {lang === 'ar' ? 'لا توجد خيارات بعد. أضف خيارك الأول!' : 'No options yet. Add your first option!'}
              </div>
            ) : (
              options.map((opt, index) => (
                <div
                  key={opt.id}
                  className={`flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl border transition ${
                    opt.hidden
                      ? 'bg-slate-900/40 border-slate-800 opacity-50'
                      : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs text-slate-500 font-mono w-4 text-center shrink-0">
                      {index + 1}
                    </span>

                    {/* Label input edit */}
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptions((prev) =>
                          prev.map((item) => (item.id === opt.id ? { ...item, label: val } : item))
                        );
                      }}
                      className="bg-transparent text-xs sm:text-sm text-slate-100 font-medium focus:outline-none focus:bg-slate-800/80 px-2 py-1 rounded w-full border border-transparent focus:border-amber-500/50"
                    />
                  </div>

                  {/* Item Action Buttons */}
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <button
                      onClick={() => toggleVisibility(opt.id)}
                      title={opt.hidden ? (lang === 'ar' ? 'إظهار' : 'Show') : (lang === 'ar' ? 'إخفاء' : 'Hide')}
                      className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800"
                    >
                      {opt.hidden ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDuplicate(opt)}
                      title={lang === 'ar' ? 'تكرار' : 'Duplicate'}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(opt.id)}
                      title={lang === 'ar' ? 'حذف' : 'Delete'}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Bulk Text Area */}
      {activeTab === 'bulk' && (
        <div className="space-y-3">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={7}
            placeholder={
              lang === 'ar'
                ? 'اكتب أو ألصق الخيارات هنا (خيار واحد في كل سطر):\nالخيار الأول\nالخيار الثاني\nالخيار الثالث'
                : 'Type or paste options here (one per line):\nOption 1\nOption 2\nOption 3'
            }
            className="w-full p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition resize-none custom-scrollbar"
          />

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? `عدد الأسطر: ${bulkText.split('\n').filter((l) => l.trim().length > 0).length}`
                : `Lines count: ${bulkText.split('\n').filter((l) => l.trim().length > 0).length}`}
            </p>

            <button
              onClick={handleApplyBulk}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow"
            >
              {lang === 'ar' ? 'تطبيق على العجلة' : 'Apply to Wheel'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom bar: Clear All */}
      {options.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
          <button
            onClick={handleClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مسح جميع الخيارات' : 'Clear All Options'}</span>
          </button>
        </div>
      )}

      {/* MODAL 1: PRESETS MODAL */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-[95vw] p-4 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  {lang === 'ar' ? 'اختر قائمة جاهزة' : 'Select Ready Preset'}
                </h3>
              </div>
              <button
                onClick={() => setShowPresetsModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {PRESET_LISTS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-500/60 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {preset.category[lang] || preset.category.en}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 mt-1">
                      {preset.title[lang] || preset.title.en}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {preset.items.slice(0, 4).join(' • ')}...
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform shrink-0">
                    {lang === 'ar' ? 'استخدام ←' : 'Use →'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AI GENERATOR MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-[95vw] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">
                  {lang === 'ar' ? 'توليد خيارات بالذكاء الاصطناعي' : 'AI Option Generator'}
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {lang === 'ar'
                ? 'اكتب الموضوع أو السؤال وسيقوم الذكاء الاصطناعي بإنشاء خيارات مناسبة فوراً لعجلتك:'
                : 'Enter a topic or question and AI will generate custom options for your wheel:'}
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'مثال: أسئلة صراحة أو جرأة، مطاعم في الرياض، تحديات...'
                    : 'e.g. Truth or Dare questions, Dinner choices, Movie genres...'
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              {aiError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {aiError}
                </p>
              )}

              <button
                onClick={handleGenerateAi}
                disabled={aiLoading || !aiTopic.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'ar' ? 'جاري التوليد...' : 'Generating...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إنشاء الخيارات الآن' : 'Generate Options'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
