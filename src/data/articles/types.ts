import { Language } from '../../types';

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
  callout?: {
    type: 'tip' | 'info' | 'warning';
    title: string;
    text: string;
  };
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: {
    en: string;
    ar: string;
  };
  author: string;
  publishedDate: string;
  readTimeMinutes: number;
  keywords: string[];
  sections: Record<Language, ArticleSection[]>;
  faqs: Record<Language, ArticleFAQ[]>;
  suggestedPresetId?: string;
  suggestedAction?: {
    label: Record<Language, string>;
    targetPage: 'wheel' | 'yesno' | 'numbers' | 'names';
  };
}
