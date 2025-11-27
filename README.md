# Brainly Frontend 🎨

A modern, responsive React frontend for the Brainly content management platform. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## ✨ Features

- **Beautiful UI** - Modern, clean interface with dark mode support
- **Smooth Animations** - Framer Motion for delightful interactions
- **Responsive Design** - Works perfectly on all devices
- **Fast Performance** - Built with Vite for lightning-fast builds
- **Type Safe** - Fully typed with TypeScript
- **Smart Search** - Debounced search with instant filtering
- **Content Management** - Save, organize, and share your content
- **Tag System** - Organize content with custom tags
- **Share Collections** - Generate shareable links
- **🆕 Discovery Feed** - Analytics dashboard with content insights, rediscovery features, and "on this day" memories

## 📋 Prerequisites

- Node.js >= 18.x
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd brainly-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🚀 Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
brainly-fe/
├── src/
│   ├── components/ui/     # Reusable UI components
│   ├── context/           # React context
│   ├── hooks/             # Custom React hooks
│   ├── Icons/             # Icon components
│   ├── Landing/           # Landing page components
│   ├── Layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── utlis/             # Utility functions
│   ├── App.tsx
│   └── config.ts
├── public/
└── package.json
```

## 🎨 Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- React Router v7
- Axios
- React Hot Toast

## 🎯 Key Features

- Landing page with hero and features
- Dashboard with grid layout
- Content management (add, delete, filter)
- Dark mode support
- Protected routes
- Shareable collections

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌐 Deployment

Configured for Vercel deployment. See `vercel.json` for configuration.

## 👤 Author

**Kushvanshi Shubham**
- GitHub: [@Kushvanshi-Shubham](https://github.com/Kushvanshi-Shubham)

---

Made with ❤️ using React + TypeScript + Vite
