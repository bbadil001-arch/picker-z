import { ColorTheme } from '../types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'vibrant',
    name: { ar: 'ألوان زاهية (افتراضي)', en: 'Vibrant Carnival (Default)' },
    colors: [
      '#EF4444', // Red
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#3B82F6', // Blue
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#14B8A6', // Teal
      '#F97316', // Orange
    ],
  },
  {
    id: 'arabic_emerald_gold',
    name: { ar: 'زمرد وذهب ملكي', en: 'Royal Emerald & Gold' },
    colors: [
      '#065F46', // Dark Emerald
      '#D97706', // Rich Amber/Gold
      '#047857', // Emerald
      '#F59E0B', // Bright Gold
      '#0F766E', // Deep Teal
      '#B45309', // Dark Gold
    ],
  },
  {
    id: 'neon',
    name: { ar: 'نيون مشع', en: 'Neon Cyberpunk' },
    colors: [
      '#FF0055', // Neon Pink
      '#00FFC8', // Cyan
      '#FFE600', // Neon Yellow
      '#9D00FF', // Purple
      '#FF5500', // Neon Orange
      '#0099FF', // Neon Blue
    ],
  },
  {
    id: 'pastel',
    name: { ar: 'باستيل هادئ', en: 'Soft Pastel' },
    colors: [
      '#FCA5A5', // Soft Red
      '#FDE047', // Soft Yellow
      '#86EFAC', // Soft Green
      '#93C5FD', // Soft Blue
      '#C084FC', // Soft Purple
      '#F472B6', // Soft Pink
    ],
  },
  {
    id: 'sunset',
    name: { ar: 'غروب الشمس', en: 'Sunset Glow' },
    colors: [
      '#818CF8', // Violet
      '#C084FC', // Purple
      '#F472B6', // Pink
      '#FB7185', // Rose
      '#F87171', // Red
      '#FB923C', // Orange
      '#FACC15', // Yellow
    ],
  },
  {
    id: 'ocean',
    name: { ar: 'نسيم المحيط', en: 'Ocean Breeze' },
    colors: [
      '#0284C7', // Sky Blue
      '#0369A1', // Deep Blue
      '#0891B2', // Cyan
      '#0D9488', // Teal
      '#059669', // Mint
      '#2563EB', // Royal Blue
    ],
  },
  {
    id: 'monochrome',
    name: { ar: 'أحادي أنيق', en: 'Monochrome Slate' },
    colors: [
      '#0F172A', // Slate 900
      '#334155', // Slate 700
      '#64748B', // Slate 500
      '#94A3B8', // Slate 400
      '#CBD5E1', // Slate 300
    ],
  },
];

export function getThemeById(themeId: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === themeId) || COLOR_THEMES[0];
}

/**
 * Calculates readable text color (white or dark slate) based on background hex color.
 */
export function getContrastTextColor(hexColor: string): string {
  if (!hexColor || !hexColor.startsWith('#')) return '#FFFFFF';
  
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  // YIQ luminance formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0F172A' : '#FFFFFF';
}

/**
 * Generates an array of colors corresponding to option indices.
 */
export function getSliceColors(count: number, themeId: string): string[] {
  const theme = getThemeById(themeId);
  const palette = theme.colors;
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    result.push(palette[i % palette.length]);
  }

  // Prevent adjacent matching colors if palette wraps evenly
  if (count > palette.length && count % palette.length === 1 && result.length > 1) {
    result[count - 1] = palette[(count) % palette.length];
  }

  return result;
}
