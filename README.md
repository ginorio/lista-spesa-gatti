[![Donate](https://img.shields.io/badge/☕_Support_me_on-PayPal-blue?logo=paypal&logoColor=white)](https://paypal.me/albidrio)


<img width="927" height="736" alt="{00A97952-E44B-46CF-A0C4-490A5F997638}" src="https://github.com/user-attachments/assets/1c80e4ee-0ed0-487b-b611-f915e99353d5" />


Family Shopping List 🛒

A responsive web app for creating and managing shopping lists by type — monthly, bi-weekly, or weekly — with:

- Quick product selection by category
- Cross-list products shared across all lists
- Full product management with custom names, comments, and store locations
- User authentication (Email/Password and Google Sign-In)
- Cloud database sync via Lovable Cloud
- Multi-language support (Italian/English with toggle on homepage)
- WhatsApp share and PDF export
- Photo import (OCR) to read printed shopping lists
- Privacy policy integration for user data protection

Live demo: http://lista-spesa-gatti.lovable.app


> Built with React + TypeScript + Vite + Tailwind + shadcn/ui, using lucide-react icons, jsPDF for export, and react-router-dom for navigation.




---

Purpose

This app saves time between “what to buy where” and “how many units I need” — especially if you shop at different stores on different schedules. The OCR import removes the annoyance of rewriting a paper list.


---

Screens and Flow

Home – Choose list type (monthly / bi-weekly / weekly), manage products, or import a list from a photo.

Products – Filtered by list, search and adjust quantities with +/− buttons.

Summary – Groups by list, includes cross-list products, allows item check-off, share via WhatsApp, and download PDF.

Manage – Add new products, bulk move selected items to another list, edit names or assigned lists, or delete.


Data is now stored in Lovable Cloud (Supabase) with user authentication and automatic sync.


---

Data Model

Available list types: monthly | biweekly | weekly | shared.
Each Product may belong to multiple lists (types: ShoppingType[]) and holds quantity and checked state.

> The initial dataset lives in src/data/products.ts and is loaded into storage on first use.




---

Core Features

**Authentication & Cloud Sync**: 
- User authentication with email/password and Google Sign-In
- Cloud database sync via Lovable Cloud (Supabase)
- Automatic migration of local data to cloud on first signup
- Row-Level Security (RLS) for data privacy

**Product Management**: 
- Add custom names, comments, and locations to products
- State management handled by useShoppingList hook
- Update, toggle, add, move, delete operations with cloud persistence

**Multi-language Support**:
- Italian and English translations
- Language toggle on homepage
- Default language: Italian

**Export & Share**:
- PDF export: generated via jsPDF, auto-paginated and grouped by list
- WhatsApp share: creates formatted messages using URL deep-links

**UI & Design**:
- Tailwind + shadcn/ui components with lucide icons
- Hash-based routing (HashRouter)
- Responsive design with dark/light mode support

**OCR Import**: 
- PhotoImport component with Gemini API integration
- Reads printed shopping lists from photos



---

Requirements

Node.js 18+

Any package manager (npm / bun / pnpm)
Project scaffold: Vite + standard scripts.



---

Quick Start

# Clone
git clone https://github.com/ginorio/lista-spesa-gatti
cd lista-spesa-gatti

# Install dependencies
npm install

# Run in dev mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

All scripts and dependencies are defined in package.json.


---

Optional Configuration

OCR / AI

If you enable OCR (Gemini API):

Create a .env file with your API key (e.g. GEMINI_API_KEY) and reference it in the OCR component.
The repository is tagged with gemini-api and ocr-recognition, confirming the feature.


Supabase (future integration)

There’s a supabase/ folder.
Currently, data persists via localStorage — Supabase will enable cloud sync and shared archives.


---

Deployment

Lovable: the project was originally deployed on Lovable (see demo link).

Alternatives: works perfectly on Vercel, Netlify, Cloudflare Pages, or GitHub Pages (deploy /dist build folder).



---

Roadmap

🗄️ Optional Supabase sync (multi-device, user profiles)

🔍 Improved search with synonyms & categories

👥 Multi-user list sharing with permissions

📱 Full PWA support (offline-first) — vite-plugin-pwa already included


Contributing

Pull requests and issues are welcome. Please keep:

clean TypeScript typings,

accessible UI components,

pure functions in hooks,

clear commit messages.



---

License

Add your license file (MIT recommended for open projects).


---

Notes

The app now uses Lovable Cloud (Supabase) for data persistence and user authentication.

Features include automatic migration from localStorage to cloud storage on first signup.
