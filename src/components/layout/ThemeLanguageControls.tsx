import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useI18n } from '@/i18n/I18nProvider';

interface ThemeLanguageControlsProps { compact?: boolean; }

export default function ThemeLanguageControls({ compact = false }: ThemeLanguageControlsProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={toggleLang} aria-label={lang === 'en' ? t('language.arabic') : t('language.english')} className="h-9 min-w-[4.25rem] px-2 border border-[#CFC3B7] bg-[#FAF7F2]/80 text-[#5C4A42] hover:bg-[#ECE4D8] dark:border-[#4A3D37] dark:bg-[#231D1A]/80 dark:text-[#E9DED3] dark:hover:bg-[#2E2622] transition-colors flex items-center justify-center gap-2 backdrop-blur-xl rounded-full">
        <span className={`text-[10px] font-black tracking-wider ${lang === 'en' ? 'opacity-100' : 'opacity-45'}`}>EN</span>
        <span className="h-3 w-px bg-[#CFC3B7] dark:bg-[#4A3D37]" />
        <span className={`text-[10px] font-black tracking-wider ${lang === 'ar' ? 'opacity-100' : 'opacity-45'}`}>AR</span>
      </button>
      <button type="button" onClick={toggleTheme} aria-label={isDark ? t('theme.light') : t('theme.dark')} title={isDark ? t('theme.light') : t('theme.dark')} className="h-9 min-w-9 px-2 border border-[#CFC3B7] bg-[#FAF7F2]/80 text-[#5C4A42] hover:bg-[#ECE4D8] dark:border-[#4A3D37] dark:bg-[#231D1A]/80 dark:text-[#E9DED3] dark:hover:bg-[#2E2622] transition-colors flex items-center justify-center gap-2 backdrop-blur-xl rounded-full">
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {!compact && <span className="hidden xl:inline text-[10px] uppercase tracking-wider">{isDark ? 'Light' : 'Dark'}</span>}
      </button>
    </div>
  );
}
