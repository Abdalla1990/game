# Internationalization (i18n) and RTL Support

This Next.js trivia game now supports internationalization with Arabic and English languages, along with RTL (Right-to-Left) layout support.

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Set the default locale (ar for Arabic, en for English)
NEXT_PUBLIC_LOCALE=ar

# Enable RTL layout (true/false)
NEXT_PUBLIC_RTL=true
```

### Supported Locales

- **Arabic (ar)**: RTL layout with Arabic fonts
- **English (en)**: LTR layout with system fonts

## Usage

### Using Translations in Components

```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('game');
  
  return (
    <div>
      <h1>{t('endGame')}</h1>
      <p>{t('endGameConfirmation')}</p>
    </div>
  );
}
```

### Translation Files

Translation files are located in the `messages/` directory:

- `messages/en.json` - English translations
- `messages/ar.json` - Arabic translations

### Translation Structure

```json
{
  "game": {
    "endGame": "End Game",
    "endGameConfirmation": "Are you sure you want to end this game?"
  },
  "navigation": {
    "account": "Account",
    "rounds": "Rounds"
  },
  "common": {
    "loading": "Loading...",
    "cancel": "Cancel",
    "confirm": "Confirm"
  }
}
```

## RTL Support

### Automatic RTL Detection

The app automatically applies RTL layout when:
1. `NEXT_PUBLIC_RTL=true` in environment variables, OR
2. The current locale is Arabic (`ar`)

### RTL-Specific CSS Classes

The app includes custom RTL utilities in `globals.css`:

```css
/* RTL text alignment */
.rtl\:text-right { text-align: right; }
.rtl\:text-left { text-align: left; }

/* RTL flex direction */
.rtl\:flex-row-reverse { flex-direction: row-reverse; }

/* RTL spacing */
.rtl\:space-x-reverse { /* reverses space between elements */ }
```

### Arabic Font Support

The app uses `Noto Sans Arabic` font for Arabic text, loaded from Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap');
```

## Development

### Adding New Translations

1. Add the key to both `messages/en.json` and `messages/ar.json`
2. Use the `useTranslations` hook in your component
3. Reference the translation key with dot notation: `t('section.key')`

### Example: Adding a New Section

English (`messages/en.json`):
```json
{
  "newSection": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

Arabic (`messages/ar.json`):
```json
{
  "newSection": {
    "title": "ميزة جديدة",
    "description": "هذه ميزة جديدة"
  }
}
```

Usage in component:
```tsx
const t = useTranslations('newSection');
return <h1>{t('title')}</h1>;
```

## Architecture

### File Structure

```
├── i18n.ts                    # i18n configuration
├── middleware.ts               # Locale detection middleware
├── messages/
│   ├── en.json                # English translations
│   └── ar.json                # Arabic translations
├── app/
│   ├── layout.tsx             # Root layout with RTL support
│   └── components/
│       └── ui/
│           └── LanguageSwitcher.tsx
```

### Key Features

1. **No URL-based routing**: Languages are controlled by environment variables
2. **Runtime RTL detection**: Automatically applies RTL styles based on locale
3. **Arabic font loading**: Optimized loading of Arabic web fonts
4. **Comprehensive RTL CSS**: Custom utilities for RTL layouts
5. **Type-safe translations**: Full TypeScript support with next-intl

## Language Switching

While the current implementation uses environment variables, you can implement runtime language switching by:

1. Using cookies or localStorage to store user preference
2. Creating a custom hook to manage locale state
3. Updating the middleware to read from the stored preference

The included `LanguageSwitcher` component provides a basic example of language switching UI.
