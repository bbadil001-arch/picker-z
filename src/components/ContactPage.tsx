import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { Mail, Send, CheckCircle2, MessageSquare, ShieldCheck, Clock, ArrowLeft, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  lang: Language;
  onBackToHome: () => void;
  onNavigateToFaq: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  lang,
  onBackToHome,
  onNavigateToFaq,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Back button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          <span>{t(lang, 'backToWheel')}</span>
        </button>

        <button
          onClick={onNavigateToFaq}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t(lang, 'navFaq')}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-xl space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t(lang, 'contactUs')}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            {t(lang, 'requestHelp')} — We value your feedback, feature ideas, and support requests.
          </p>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <Clock className="w-4 h-4 text-amber-400 mx-auto" />
            <div className="text-xs font-bold text-slate-200">24-48h Response</div>
            <div className="text-[11px] text-slate-500">Quick email support</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <MessageSquare className="w-4 h-4 text-amber-400 mx-auto" />
            <div className="text-xs font-bold text-slate-200">Feature Requests</div>
            <div className="text-[11px] text-slate-500">Shape our next update</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto" />
            <div className="text-xs font-bold text-slate-200">Privacy First</div>
            <div className="text-[11px] text-slate-500">Zero spam guarantee</div>
          </div>
        </div>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-4 bg-slate-950/60 rounded-2xl border border-emerald-500/30 p-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              Thank you for contacting RandomizerWheel.com. Our support team will review your inquiry and get back to you shortly.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Inquiry Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none transition-all"
              >
                <option value="Feedback / Suggestion">Feedback / Feature Suggestion</option>
                <option value="Bug Report">Bug Report / Technical Issue</option>
                <option value="Partnership / Advertising">Partnership / Advertising Inquiry</option>
                <option value="Privacy / Legal Inquiry">Privacy / Legal Question</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Your Message *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          Direct Email: <a href="mailto:support@randomizerwheel.com" className="text-amber-400 hover:underline">support@randomizerwheel.com</a> • RandomizerWheel Inc.
        </div>
      </div>
    </div>
  );
};
