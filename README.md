[![Donate](https://img.shields.io/badge/☕_Support_me_on-PayPal-blue?logo=paypal&logoColor=white)](https://paypal.me/albidrio)


<img width="1118" height="854" alt="image" src="https://github.com/user-attachments/assets/346bc70c-d064-4903-abbf-ebb695f1856e" />



Family Shopping List 🛒

A responsive web app for creating and managing shopping lists by type — monthly, bi-weekly, or weekly — with:

- Quick product selection by category
- Cross-list products shared across all lists
- Full product management with custom names, comments, and store locations
- **Barcode scanner** with OpenFoodFacts API integration for quick product addition
- User authentication (Email/Password and Google Sign-In)
- Cloud database sync via Lovable Cloud (Supabase)
- Multi-language support (Italian/English with toggle on homepage)
- WhatsApp share and PDF export
- **Photo import (OCR)** to read printed shopping lists and add directly to cart
- Privacy policy integration for user data protection

Live demo: http://lista-spesa-gatti.lovable.app


> Built with React + TypeScript + Vite + Tailwind + shadcn/ui, using lucide-react icons, jsPDF for export, and react-router-dom for navigation.




---

Purpose

This app saves time between "what to buy where" and "how many units I need" — especially if you shop at different stores on different schedules. The OCR import removes the annoyance of rewriting a paper list, and the barcode scanner makes adding products quick and accurate.


---

Screens and Flow

Home – Choose list type (monthly / bi-weekly / weekly), manage products, or import a list from a photo.

Products – Filtered by list, search and adjust quantities with +/− buttons.

Summary – Groups by list, includes cross-list products, allows item check-off, share via WhatsApp, and download PDF.

Manage – Add new products, scan barcodes, bulk move selected items to another list, edit names or assigned lists, or delete.


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
- Row-Level Security (RLS) for data privacy
- Real-time data synchronization across devices

**Product Management**: 
- Add custom names, comments, and locations to products
- **Barcode scanner** using html5-qrcode library
- OpenFoodFacts API integration for automatic product name retrieval
- State management handled by useShoppingList hook with Supabase backend
- Update, toggle, add, move, delete operations with cloud persistence
- Bulk move products between lists
- Search and filter products

**Multi-language Support**:
- Italian and English translations
- Language toggle on homepage
- Default language: Italian
- All UI elements fully translated including categories and messages

**Export & Share**:
- PDF export: generated via jsPDF, auto-paginated and grouped by list
- WhatsApp share: creates formatted messages using URL deep-links
- Shopping list checklist with item completion tracking

**UI & Design**:
- Tailwind + shadcn/ui components with lucide icons
- Hash-based routing (HashRouter)
- Responsive design with semantic color tokens
- Accessible form controls and dialogs

**OCR Import & Smart Add**: 
- PhotoImport component with Lovable AI (Gemini) integration
- Reads printed shopping lists from photos
- Two-button action: add to product database or add directly to shopping cart
- Automatic product recognition and category assignment



---

Requirements

Node.js 18+

Any package manager (npm / bun / pnpm)
Project scaffold: Vite + standard scripts.



---

Quick Start

```bash
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
```

All scripts and dependencies are defined in package.json.


---

Configuration

**Lovable Cloud (Required)**

This project uses Lovable Cloud which provides:
- Supabase backend automatically configured
- Edge functions for OCR processing
- User authentication and database management
- Environment variables are auto-configured

**Edge Functions**:
- `ocr-products`: Uses Lovable AI (Gemini) to recognize products from photos
- Automatically deployed when code changes

**Database Tables**:
- `profiles`: User profile information
- `user_products`: Product data with RLS policies per user
- Includes fields: name, types[], quantity, checked, custom_name, comment, location

**External APIs**:
- OpenFoodFacts API for barcode scanning (no API key required)


---

Deployment

Lovable: the project was originally deployed on Lovable (see demo link).

Alternatives: works perfectly on Vercel, Netlify, Cloudflare Pages, or GitHub Pages (deploy /dist build folder).



---

Roadmap

✅ ~~Cloud sync with Supabase~~ — **Completed**

✅ ~~User authentication~~ — **Completed**

✅ ~~Barcode scanner~~ — **Completed**

✅ ~~Photo OCR import~~ — **Completed**

🔍 Improved search with synonyms & autocomplete

👥 Multi-user list sharing with family permissions

📱 Full PWA support (offline-first with service workers)

🔔 Push notifications for shared lists

🎨 Customizable themes and list layouts


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

Technical Stack

**Frontend**:
- React 18 + TypeScript
- Vite for build and dev server
- Tailwind CSS with semantic design tokens
- shadcn/ui component library
- lucide-react icons

**Backend (Lovable Cloud)**:
- Supabase for database and authentication
- Edge Functions (Deno) for serverless logic
- Row-Level Security (RLS) policies
- Lovable AI for OCR processing

**Key Libraries**:
- react-router-dom: Navigation
- html5-qrcode: Barcode scanning
- jsPDF: PDF generation
- @supabase/supabase-js: Database client
- sonner: Toast notifications

**Development**:
- ESLint for code quality
- TypeScript for type safety
- Vite PWA plugin for progressive web app features

---

Notes

- This app is built and deployed on Lovable with full cloud integration
- All data is stored securely in Supabase with user-level isolation
- Barcode scanning uses device camera via html5-qrcode library
- OCR feature powered by Lovable AI (Gemini) through edge functions
