# CodeByArt ATS Resume Builder

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A modern, ATS-friendly resume builder with real-time preview and optimization suggestions.**

[Live Demo](#) • [Features](#features) • [Quick Start](#quick-start) • [Deployment](#deployment)

</div>

---

## Features

- 📝 **Real-time Resume Editor** - Edit your resume with instant live preview
- 📊 **ATS Score Analysis** - Get optimization suggestions for better ATS compatibility
- 📄 **PDF Export** - Export your resume as a professional PDF
- 🎨 **Clean, Modern UI** - Built with Tailwind CSS for a polished look
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Recharts | Data Visualization |
| Lucide React | Icons |

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/techiekamal21/codebyart-ats-resume-builder.git

# Navigate to project directory
cd codebyart-ats-resume-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

## Project Structure

```
codebyart-ats-resume-builder/
├── components/
│   ├── Analysis/       # ATS score analysis components
│   ├── Editor/         # Resume editor components
│   ├── Preview/        # Live preview components
│   └── ui/             # Reusable UI components
├── App.tsx             # Main application component
├── constants.ts        # Default data and configurations
├── types.ts            # TypeScript type definitions
├── index.html          # HTML entry point
└── vite.config.ts      # Vite configuration
```

## Deployment

This app can be deployed to any static hosting platform. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment guides.

**Recommended Platforms:**
- ✅ **Vercel** (Recommended) - Zero-config deployment
- ✅ **Netlify** - Easy CI/CD integration

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Optional - For future AI-powered features |

> **Note:** The current version uses mock ATS analysis. The Gemini API key is reserved for future AI-powered enhancements.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

- **Designed by:** [@techiekamal21](https://github.com/techiekamal21)
- **Powered by:** [Connect Kreations](https://connectkreations.com) & [CodeByArt](https://codebyart.com)

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

<div align="center">

**Made with ❤️ by [techiekamal](https://instagram.com/techiekamal)**

</div>
