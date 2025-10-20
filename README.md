[![Donate](https://img.shields.io/badge/☕_Support_me_on-PayPal-blue?logo=paypal&logoColor=white)](https://paypal.me/albidrio)


<img width="927" height="736" alt="{00A97952-E44B-46CF-A0C4-490A5F997638}" src="https://github.com/user-attachments/assets/1c80e4ee-0ed0-487b-b611-f915e99353d5" />


Lista Spesa Gatti 🐾

A responsive web app for creating and managing shopping lists by type — monthly, bi-weekly, or weekly — with:

quick product selection by category,

cross-list products shared across all lists,

full product management (add, edit, move, delete),

local save and persistence,

WhatsApp share and PDF export,

photo import (OCR) to read printed shopping lists.
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


All data is stored in localStorage for simplicity.


---

Data Model

Available list types: monthly | biweekly | weekly | shared.
Each Product may belong to multiple lists (types: ShoppingType[]) and holds quantity and checked state.

> The initial dataset lives in src/data/products.ts and is loaded into storage on first use.




---

Core Features

State management & storage: handled by useShoppingList hook, including update, toggle, add, move, delete, and filters.

PDF export: generated via jsPDF, auto-paginated and grouped by list and shared products.

Share: creates a formatted WhatsApp message using URL deep-links.

UI: Tailwind + shadcn/ui components with lucide icons and hash-based routing (HashRouter).

OCR import: PhotoImport component connects to OCR functionality (Gemini API integration hinted by repo topics).



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

🧠 Smarter OCR mapping (“text → product” via fuzzy matching)

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

The app works fully offline using localStorage.

Backend integration (Supabase) is optional and can be added later.
