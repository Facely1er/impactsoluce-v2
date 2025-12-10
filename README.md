# ImpactSoluce™

**ESG Risk Intelligence**

by ERMITS

Transform environmental, social, and governance obligations into decision-grade intelligence. Know where your impact exposure is — before regulators, buyers, or financiers ask.

## Core Features

- **Impact Risk Radar™**: Sector, geography, and supply-chain exposure analysis
- **Evidence Readiness Workspace**: Centralized evidence inventory and readiness tracking
- **Impact Scan**: Comprehensive ESG posture assessment (foundation layer)
- **Regulatory Intelligence Modules**: EUDR, Child Labor, Supply Chain, Climate Disclosure

## What ImpactSoluce Does

- Converts your footprint into ESG exposure signals
- Identifies regulatory pressure by region
- Tracks evidence readiness for compliance
- Shows what exists, what's missing, and where pressure will hit next

## What ImpactSoluce Is NOT

- ❌ Does not generate ESG stories
- ❌ Does not replace consultants
- ❌ Does not certify or score moral performance
- ❌ Does not recommend remediation actions

ImpactSoluce is an intelligence layer, not an opinion engine.

## Additional Features

- Multi-language support (English, French)
- Responsive design for all devices
- Standards mapping (GRI, SASB, TCFD, CSRD, ISSB, ISO)
- Export capabilities for regulators, buyers, and auditors

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

#### With Database (Shared with AgroSoluce)

ImpactSoluce uses the same shared Supabase database as AgroSoluce. To enable backend persistence:

1. Configure your Supabase credentials in `.env`:
```env
# Shared database with AgroSoluce
VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8
VITE_SUPABASE_SCHEMA=impactsoluce
```

**Note:** The application will use the shared database by default even without these environment variables. The schema defaults to `impactsoluce` to keep data separate from AgroSoluce's `agrosoluce` schema.

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
