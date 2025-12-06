# ImpactSoluce™ by ERMITS

A comprehensive ESG (Environmental, Social, and Governance) assessment platform that helps organizations measure and improve their sustainability performance.

## Features

- Comprehensive ESG assessments across multiple frameworks
- Real-time scoring and analytics
- Carbon footprint tracking
- Standards mapping (GRI, SASB, TCFD, etc.)
- Multi-language support (English, French)
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template:

```bash
cp .env.example .env
```

### Running the Application

#### Standalone Mode (No Database Required)

The application works out of the box without any configuration:

```bash
npm run dev
```

This runs the app in standalone mode with local storage for data persistence. No database setup required!

#### With Database (Optional)

To enable backend persistence with Supabase:

1. Configure your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Run the application:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check with TypeScript

## Architecture

### Standalone Mode

The application is designed to work completely standalone without requiring a database. In this mode:

- All data is stored in browser localStorage
- Assessment data persists between sessions
- Full functionality available offline
- Easy data export/import for backup

### Data Management

#### Export Data

Your assessment data can be exported as JSON for backup or migration:

```javascript
import { localStorageService } from './utils/localStorage';
const exportedData = localStorageService.exportData();
// Save to file or copy to clipboard
```

#### Import Data

Import previously exported data:

```javascript
import { localStorageService } from './utils/localStorage';
localStorageService.importData(jsonData);
```

## Technology Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query
- Chart.js
- i18next (internationalization)
- Supabase (optional backend)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
