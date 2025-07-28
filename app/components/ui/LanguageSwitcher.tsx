'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState(process.env.NEXT_PUBLIC_LOCALE || 'ar');

  const switchLanguage = (locale: string) => {
    startTransition(() => {
      // Update environment variable approach would require server restart
      // For runtime switching, you might want to use cookies or localStorage
      setCurrentLocale(locale);

      // Refresh the page to apply new locale
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={() => switchLanguage('en')}
        disabled={isPending}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentLocale === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('ar')}
        disabled={isPending}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentLocale === 'ar'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        العربية
      </button>
    </div>
  );
}
