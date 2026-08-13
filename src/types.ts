export interface WheelOption {
  id: string;
  label: string;
  color?: string;
  weight?: number;
  hidden?: boolean;
}

export interface ColorTheme {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  colors: string[];
}

export interface WheelConfig {
  title: string;
  spinDuration: number; // in seconds
  soundEnabled: boolean;
  volume: number; // 0 to 1
  autoRemoveWinner: boolean;
  themeId: string;
  customBgColor: string;
  customTextColor: string;
  customPointerColor: string;
  tickerType: 'top' | 'right' | 'left';
}

export interface SpinHistoryItem {
  id: string;
  winner: string;
  timestamp: string;
  totalOptionsCount: number;
}

export interface PresetList {
  id: string;
  category: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  items: string[];
}
