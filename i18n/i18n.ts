import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default getRequestConfig(async () => {
  // Get locale from environment variable or header
  const headersList = headers();
  const locale = process.env.NEXT_PUBLIC_LOCALE || headersList.get('x-locale') || 'ar';

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
