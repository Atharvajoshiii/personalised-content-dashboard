<div align="center">

# 🌟 **Dashboard Universe** 🌟
### *Your Ultimate Content Aggregation Platform*

<br/>

[![Next.js](https://img.shields.io/badge/Built_with-Next.js_15.4.6-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Powered_by-TypeScript_5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/UI_with-React_18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/State-Redux_Toolkit_2.8.2-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/Styled_with-TailwindCSS_4.1.11-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

```ascii
╔══════════════════════════════════════════════════════════════════════════════════╗
║  � PERSONALIZED DASHBOARD - WHERE CONTENT MEETS INNOVATION 🚀                   ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

</div>

---

## 📖 **Table of Contents**

<details>
<summary>🗂️ Click to expand navigation</summary>

- [🌟 **What Makes This Special**](#-what-makes-this-special)
- [⚡ **Quick Launch Guide**](#-quick-launch-guide)
- [🎯 **Command Arsenal**](#-command-arsenal)
- [🏗️ **Architecture Deep Dive**](#️-architecture-deep-dive)
- [🎨 **Content Showcase**](#-content-showcase)
- [🔧 **Technology Powerhouse**](#-technology-powerhouse)
- [🎪 **Interactive Magic**](#-interactive-magic)
- [🧪 **Quality Assurance**](#-quality-assurance)
- [🚀 **Going Live**](#-going-live)
- [🛡️ **Security & Performance**](#️-security--performance)
- [🔮 **What's Next**](#-whats-next)
- [📜 **Legal & Community**](#-legal--community)

</details>

---

## 🌟 **What Makes This Special**

<table>
<tr>
<td width="50%">

### 🎨 **User-Centric Design**
- 🎯 Multi-API content aggregation (News, Movies, Social)
- 🎛️ Fully customizable user preferences
- 📱 Seamless responsive experience across devices
- 🌓 Intelligent dark/light mode with system detection
- 🔍 Lightning-fast search with real-time debouncing
- ❤️ Advanced favorites management system
- 🎪 Intuitive drag-and-drop interface
- 📊 Real-time API health monitoring

</td>
<td width="50%">

### 🛠️ **Technical Excellence**
- 🔐 Enterprise-grade authentication (NextAuth.js)
- 🧪 Comprehensive testing suite (196+ tests)
- 🎭 Robust error boundaries and recovery
- ⚡ Advanced performance optimizations
- 🔒 Strict TypeScript implementation
- 📡 Resilient API integration layer
- 🖱️ Smooth drag-and-drop interactions
- 🔄 Persistent state management
- 🎬 Unified multi-content interface
- 🎨 Dynamic category filtering
- 📈 Beautiful loading animations

</td>
</tr>
</table>

---

## ⚡ **Quick Launch Guide**

> � *Get your dashboard running in under 5 minutes!*

### 🎯 **Prerequisites Checklist**

| Component | Version | Status |
|-----------|---------|--------|
| � Node.js | v18.0.0+ | ✅ Required |
| 📦 npm | v8.0.0+ | ✅ Required |
| � Git | Latest | ✅ Required |

### 🎬 **Installation Cinema**

<details>
<summary>🎪 <strong>Step 1: Repository Acquisition</strong></summary>

```bash
# 🌍 Clone via HTTPS
git clone https://github.com/your-username/personalised-dashboard.git

# 🔐 Or clone via SSH (recommended for contributors)
git clone git@github.com:your-username/personalised-dashboard.git

# 📁 Enter the universe
cd personalised-dashboard
```

</details>

<details>
<summary>📦 <strong>Step 2: Dependency Installation</strong></summary>

```bash
# 🚀 Using npm (Lightning fast)
npm install

# 🧶 Or using yarn (Alternative)
yarn install

# ⚡ Or using pnpm (Performance focused)
pnpm install
```

</details>

<details>
<summary>🔑 <strong>Step 3: Environment Configuration</strong></summary>

```bash
# 📝 Create environment file
touch .env.local

# 📋 Copy this template to .env.local
cat << 'EOF' > .env.local
# 🔑 Essential API Keys
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here

# 🔐 Authentication Setup (Optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_here

# 🗄️ Database Connection (Optional)
DATABASE_URL="your_database_connection_string"
EOF
```

**🔗 API Key Sources:**
- 📰 **News API**: [newsapi.org/register](https://newsapi.org/register) (Free tier: 1000 requests/day)
- 🎬 **OMDB API**: [omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx) (Free tier: 1000 requests/day)

</details>

<details>
<summary>� <strong>Step 4: Launch Sequence</strong></summary>

```bash
# 🚀 Development server with Turbopack (Recommended)
npm run dev

# 🌐 Traditional Webpack mode
npm run dev --no-turbopack

# 🎯 Alternative package managers
yarn dev    # Using yarn
pnpm dev    # Using pnpm
```

**� Access Points:**
- 🏠 **Main Dashboard**: [localhost:3000](http://localhost:3000)
- 🔧 **Debug Interface**: [localhost:3000/debug-drag](http://localhost:3000/debug-drag)
- 🎮 **Demo Playground**: [localhost:3000/drag-drop-demo](http://localhost:3000/drag-drop-demo)

</details>

---

## 🎯 **Command Arsenal**

> � *Master your development workflow with these powerful commands*

<div align="center">

### � **Development Commands**

</div>

| Command | Description | Speed | Use Case |
|---------|-------------|-------|----------|
| `npm run dev` | � Turbopack development server | ⚡⚡⚡ | Daily development |
| `npm run dev --no-turbopack` | 🏗️ Traditional Webpack server | ⚡⚡ | Compatibility mode |
| `npm run build` | 🎯 Production build | ⚡ | Pre-deployment |
| `npm run start` | 🌟 Production server | ⚡⚡ | Production testing |
| `npm run lint` | � Code quality check | ⚡⚡ | Code review |
| `npm run lint --fix` | � Auto-fix linting issues | ⚡⚡ | Quick cleanup |

<div align="center">

### 🧪 **Testing Commands**

</div>

| Command | Description | Coverage | Output |
|---------|-------------|----------|--------|
| `npm run test` | 🧪 Run all tests | Full | Terminal |
| `npm run test:watch` | � Watch mode testing | Incremental | Interactive |
| `npm run test:coverage` | � Generate coverage report | Complete | HTML + Terminal |
| `npm run test:ci` | 🤖 CI/CD testing | Full | JSON + Terminal |
| `npx cypress open` | 🎭 E2E testing GUI | Integration | Cypress UI |
| `npx cypress run` | 🎭 E2E headless testing | Integration | Terminal |

<div align="center">

### �️ **Utility Commands**

</div>

<details>
<summary>� <strong>Package Management</strong></summary>

```bash
# 📦 Dependency operations
npm install <package-name>              # Add new dependency
npm install --save-dev <package-name>   # Add dev dependency
npm update                              # Update all packages
npm outdated                           # Check outdated packages
npm audit                              # Security audit
npm audit fix                          # Fix vulnerabilities

# 🧹 Maintenance operations
rm -rf node_modules package-lock.json && npm install  # Clean reinstall
npm list                               # List installed packages
npm list --depth=0                     # List top-level packages
```

</details>

<details>
<summary>🎨 <strong>Build & Analysis</strong></summary>

```bash
# 🎨 Styling commands
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch

# � Bundle analysis
npm run build && npx @next/bundle-analyzer

# 🧹 Cleanup operations
rm -rf .next                          # Clean build files
rm -rf .next node_modules             # Deep clean

# � Code formatting
npx prettier --write .                # Format all files
npx prettier --check .                # Check formatting

# � Type checking
npx tsc --noEmit                      # Check TypeScript errors
npx tsc --noEmit --incremental        # Incremental type check
```

</details>

<details>
<summary>� <strong>Development Tools</strong></summary>

```bash
# � Performance analysis
npx lighthouse http://localhost:3000 --output html
npm run dev -- --profile             # Performance profiling

# 🕵️ Debugging commands
npm run dev -- --inspect             # Node.js debugging
npm run dev -- --turbo --log-level=debug  # Verbose logging

# � Advanced build options
npm run build -- --profile           # Build with profiling
npm run build -- --debug             # Debug build process
```

</details>

---

## �️ **Architecture Deep Dive**

> 🔍 *Explore the blueprint of our sophisticated application structure*

<div align="center">

```
🏰 DASHBOARD CASTLE ARCHITECTURE
┌─────────────────────────────────────────────────────────────────┐
│                    🎯 MAIN ENTRANCE (Root)                     │
├─────────────────────────────────────────────────────────────────┤
│  � app/                     │  🧪 testing/                    │
│  📁 cypress/                 │  📁 public/                     │
│  📄 config files            │  📄 documentation                │
└─────────────────────────────────────────────────────────────────┘
```

</div>

### 🎯 **Core Application Structure**

<details>
<summary>📱 <strong>Frontend Layer (app/)</strong></summary>

```bash
app/
├── 🎨 Presentation Layer
│   ├── 📄 globals.css          # Universal styling system
│   ├── 📄 layout.tsx           # Application shell
│   ├── � page.tsx             # Landing experience
│   └── 📄 theme.css            # Theme management
│
├── 🌐 API Layer
│   ├── � auth/                # Authentication endpoints
│   ├── 📁 placeholder-image/   # Image fallback service
│   └── 📁 profile/             # User management APIs
│
├── 🔐 Authentication Layer
│   └── 📁 signin/              # Secure access portal
│
├── 🧩 Component Ecosystem
│   ├── 📁 content/             # Content rendering engine
│   │   ├── ContentCard.tsx           # Individual content units
│   │   ├── ContentFeed.tsx           # Content aggregation
│   │   ├── CategorizedContentFeed.tsx # Filtered content streams
│   │   ├── DragDropWrapper.tsx       # Interactive container
│   │   └── SimpleDragDropFeed.tsx    # Demo interface
│   │
│   ├── 📁 layout/              # Structural components
│   │   ├── Header.tsx                # Navigation header
│   │   ├── Navigation.tsx            # Menu system
│   │   └── Sidebar.tsx               # Side navigation
│   │
│   ├── 📁 providers/           # Context management
│   │   ├── ReduxProvider.tsx         # State management
│   │   └── ThemeProvider.tsx         # Theme context
│   │
│   └── 📁 ui/                  # Reusable interface elements
│       ├── Button.tsx                # Interactive buttons
│       ├── Modal.tsx                 # Dialog system
│       └── SearchBar.tsx             # Search interface
└── � dashboard/page.tsx       # Main dashboard hub
```

</details>

<details>
<summary>� <strong>Logic Layer (hooks/, services/, store/)</strong></summary>

```bash
🧠 Business Logic Layer
├── � hooks/                   # Custom React logic
│   ├── redux.ts               # Type-safe Redux hooks
│   ├── useApiData.ts          # Data fetching logic
│   ├── useCategorizedNews.ts  # News categorization
│   ├── useDebounce.ts         # Performance optimization
│   ├── useDebounceSearch.ts   # Search optimization
│   ├── useDndKit.ts           # Drag & drop abstraction
│   ├── useDragAndDrop.ts      # Interactive logic
│   └── useMovieSearch.ts      # Movie search logic
│
├── 📁 services/               # External communication
│   ├── api.ts                 # Core API client
│   ├── apiKeys.ts             # Key management
│   ├── mockApi.ts             # Development mocks
│   └── movieAPI.ts            # Movie service
│
├── 📁 store/                  # State management
│   ├── index.ts               # Store configuration
│   ├── authSlice.ts           # Authentication state
│   ├── contentSlice.ts        # Content management
│   ├── errorSlice.ts          # Error handling
│   ├── preferencesSlice.ts    # User preferences
│   ├── searchSlice.ts         # Search state
│   └── themeSlice.ts          # Theme state
│
├── 📁 lib/                    # Utility libraries
│   ├── auth.ts                # Auth configuration
│   └── authService.ts         # Auth operations
│
├── � types/                  # Type definitions
│   └── index.ts               # Global interfaces
│
└── 📁 utils/                  # Helper functions
    ├── dateUtils.ts           # Date operations
    ├── imageUtils.ts          # Image processing
    └── validation.ts          # Input validation
```

</details>

<details>
<summary>🧪 <strong>Quality Assurance Layer</strong></summary>

```bash
🛡️ Quality Assurance Infrastructure
├── 📁 testing/                # Unit testing suite
│   ├── README.md              # Testing documentation
│   ├── 📁 data/               # Mock data repository
│   ├── 📁 mocks/              # Service mocks
│   ├── 📁 setup/              # Jest configuration
│   ├── 📁 unit/               # Component tests
│   └── 📁 utils/              # Testing utilities
│
├── 📁 cypress/                # End-to-end testing
│   ├── 📁 e2e/                # User journey tests
│   ├── 📁 fixtures/           # Test data fixtures
│   └── 📁 support/            # Cypress extensions
│
└── 📁 Configuration Files
    ├── jest.config.js         # Unit test config
    ├── cypress.config.ts      # E2E test config
    ├── eslint.config.mjs      # Code quality rules
    ├── tsconfig.json          # TypeScript config
    ├── tailwind.config.ts     # Styling config
    └── next.config.ts         # Next.js config
```

</details>

### 🎨 **Content Gallery**

<div align="center">

| Content Type | Features | Data Source | Interactive Elements |
|--------------|----------|-------------|----------------------|
| � **News Cards** | Headlines, Images, Authors, Dates | News API | ❤️ Favorites, 🔗 Links, 🏷️ Categories |
| � **Movie Cards** | Posters, Ratings, Genres, Plots | OMDB API | ⭐ Ratings, 🎯 Quick Actions |
| � **Social Cards** | Profiles, Content, Media, Engagement | Mock Data | 💬 Interactions, 🏷️ Hashtags |

</div>

### 🎯 **Content Specifications**

<table>
<tr>
<td width="33%">

#### 📰 **News Experience**
- ✨ Eye-catching headlines
- 🖼️ High-quality thumbnails  
- 👤 Author attribution
- 📅 Timestamp formatting
- � Source linking
- 🏷️ Category tagging
- 🎨 Rich typography

</td>
<td width="33%">

#### 🎬 **Movie Discovery**
- 🎬 Title and release year
- �️ High-resolution posters
- ⭐ IMDb ratings display
- 🎭 Genre classification
- 📝 Plot summaries
- 🎯 Quick action buttons
- 🎨 Cinematic design

</td>
<td width="33%">

#### 📱 **Social Interaction**
- 👤 User avatars
- 📝 Rich content formatting
- 🖼️ Media previews
- 📅 Relative timestamps
- 💬 Engagement metrics
- 🏷️ Hashtag parsing
- 🎨 Social-first design

</td>
</tr>
</table>

## 🛠️ Technology Stack

### 🏗️ **Core Framework**
- ⚛️ **Next.js 15.4.6** - React framework with App Router
- ⚛️ **React 18.3.1** - UI library with concurrent features
- 📘 **TypeScript 5.0** - Static type checking
- 🎨 **TailwindCSS 4.1.11** - Utility-first CSS framework

### 🔄 **State Management**
- 🗃️ **Redux Toolkit 2.8.2** - Predictable state container
- 🔗 **React Redux 9.2.0** - React bindings for Redux
- 💾 **localStorage** - Client-side persistence

### 🎪 **Animations & Interactions**
- 🎭 **Framer Motion 12.23.12** - Advanced animations
- 🖱️ **React Beautiful DnD 13.1.1** - Drag and drop functionality
- 🎨 **Smooth transitions** - Custom CSS animations

### 🌐 **API & Data Fetching**
- 📡 **Axios 1.11.0** - HTTP client with interceptors
- 🔄 **Custom hooks** - Reusable data fetching logic
- ⏱️ **Debouncing** - Optimized search performance

### 🔐 **Authentication & Security**
- 🔒 **NextAuth.js 4.24.11** - Authentication for Next.js
- 🔐 **bcryptjs 3.0.2** - Password hashing
- 🛡️ **Input validation** - XSS and injection protection

### 🧪 **Testing Infrastructure**
- 🧪 **Jest 30.0.5** - JavaScript testing framework
- 🎭 **Testing Library** - Simple and complete testing utilities
- 🤖 **Cypress 14.5.4** - End-to-end testing
- 📊 **Coverage reporting** - Code coverage metrics

### 🛠️ **Development Tools**
- 📝 **ESLint** - Code linting and formatting
- 🔧 **TypeScript ESLint** - TypeScript-specific linting
- ⚡ **Turbopack** - Fast bundler for development
- 🔍 **Type checking** - Compile-time error detection

## 🎮 Drag & Drop Features

### ✨ **Interactive Experience**
- 🖱️ **Smooth Dragging**: Fluid drag animations with visual feedback
- 🎯 **Drop Zones**: Clear visual indicators for valid drop areas
- 🔄 **Auto-Save**: Preferences automatically saved to localStorage
- 📱 **Touch Support**: Full mobile and tablet compatibility
- ♿ **Accessibility**: Keyboard navigation and screen reader support

### 🎨 **Visual Feedback**
```typescript
// Visual transformations during drag
🔄 Rotation: 1-2 degrees for natural feel
📏 Scale: 1.02-1.05x for emphasis
🌟 Shadow: Dynamic shadow depth
✨ Opacity: Smooth transparency effects
🎯 Indicators: Real-time drag status
```

### 🧪 **Test Pages**
```bash
# 🔧 Debug drag functionality
http://localhost:3000/debug-drag

# 🎮 Full drag & drop demo
http://localhost:3000/drag-drop-demo

# 🏠 Main dashboard with integrated DnD
http://localhost:3000/dashboard
```

## 🧪 Testing Infrastructure

### 📊 **Test Coverage Statistics**
- 🎯 **196 Total Tests** across 9 test suites
- ✅ **134 Passing Tests** (68% pass rate)
- 📈 **14.49% Code Coverage** with detailed reporting
- 🔧 **134 Unit Tests** for components and logic
- 🎭 **E2E Tests** for critical user flows

### 🏗️ **Testing Architecture**
```
testing/
├── 📁 data/          # Mock API responses and test data
├── 📁 mocks/         # Mock implementations for APIs
├── 📁 setup/         # Jest configuration and globals
├── 📁 unit/          # Component and logic unit tests
├── 📁 utils/         # Testing utilities and helpers
└── 📄 README.md      # Testing documentation
```

### 🧪 **Test Categories**
- ✅ **Component Tests**: UI component behavior and rendering
- ✅ **Hook Tests**: Custom React hooks functionality
- ✅ **Redux Tests**: State management and actions
- ✅ **API Tests**: Service layer and data fetching
- ✅ **Integration Tests**: Component interaction testing
- ✅ **E2E Tests**: Complete user flow validation

## 🚀 Deployment & Production

### 🌍 **Deployment Options**
```bash
# 🏗️ Build for production
npm run build

# 🚀 Start production server
npm run start

# 📊 Analyze bundle size
npm run build && npx @next/bundle-analyzer

# 🔍 Performance audit
npx lighthouse http://localhost:3000
```

### 🏢 **Platform Deployment**
```bash
# 🌍 Deploy to Vercel (recommended)
npx vercel

# 🐳 Docker deployment
docker build -t personalised-dashboard .
docker run -p 3000:3000 personalised-dashboard

# 📦 Static export (if needed)
npm run build && npm run export
```

### ⚙️ **Production Environment Variables**
```env
# Production API keys
NEXT_PUBLIC_NEWS_API_KEY=prod_news_api_key
NEXT_PUBLIC_OMDB_API_KEY=prod_omdb_api_key

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_secret

# Database (if using auth)
DATABASE_URL=your_production_database_url

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🔧 Configuration Files

### 📄 **Key Configuration Files**
```typescript
// next.config.ts - Next.js configuration
export default {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  }
}

// tailwind.config.ts - TailwindCSS configuration
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)'
      }
    }
  }
}

// jest.config.js - Testing configuration
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/testing/setup/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/app/$1'
  }
}
```

## 🎯 Performance Optimization

### ⚡ **Built-in Optimizations**
- 🎯 **Code Splitting**: Automatic route-based splitting
- 🖼️ **Image Optimization**: Next.js Image component
- 🗂️ **Tree Shaking**: Unused code elimination
- 💾 **Caching**: Intelligent caching strategies
- ⚡ **Turbopack**: Fast development bundling
- 🔄 **Lazy Loading**: Component and image lazy loading

### 📊 **Performance Metrics**
```bash
# 📊 Lighthouse audit
npx lighthouse http://localhost:3000 --output html

# 📈 Bundle analyzer
npm run build && npx @next/bundle-analyzer

# ⏱️ Performance profiling
npm run dev -- --profile

# 🔍 Type checking performance
npx tsc --noEmit --incremental
```

## 🔒 Security Features

### 🛡️ **Security Measures**
- 🔐 **Environment Variables**: Secure API key storage
- 🚫 **Input Validation**: XSS and injection prevention
- 🔒 **HTTPS Enforcement**: Secure connections only
- 🛡️ **CSRF Protection**: Cross-site request forgery prevention
- 🔑 **Authentication**: Secure user authentication
- 📝 **Content Security Policy**: CSP headers

### 🔐 **API Security**
```typescript
// API key validation
const validateApiKey = (key: string): boolean => {
  return key && key.length > 10 && !key.includes('demo');
};

// Request sanitization
const sanitizeInput = (input: string): string => {
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '');
};
```

## 🐛 Troubleshooting

### 🔧 **Common Issues & Solutions**

#### 🚫 **API Key Issues**
```bash
# Problem: "Invalid API key" error
# Solution: Check environment variables
echo "News API Key: $NEXT_PUBLIC_NEWS_API_KEY"
echo "OMDB API Key: $NEXT_PUBLIC_OMDB_API_KEY"

# Verify API key format
curl -H "X-API-Key: $NEXT_PUBLIC_NEWS_API_KEY" \
     "https://newsapi.org/v2/top-headlines?country=us"
```

#### 🌐 **Network Issues**
```bash
# Problem: API requests failing
# Solution: Check network connectivity
ping newsapi.org
ping omdbapi.com

# Test API endpoints
curl "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_KEY"
curl "http://www.omdbapi.com/?i=tt3896198&apikey=YOUR_KEY"
```

#### 🏗️ **Build Issues**
```bash
# Problem: Build failing
# Solution: Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Verify dependencies
npm audit
npm outdated
```

#### 🧪 **Test Issues**
```bash
# Problem: Tests failing
# Solution: Update snapshots and clear cache
npm run test -- --updateSnapshot
npm run test -- --clearCache

# Run specific test suite
npm run test -- --testNamePattern="SearchBar"

# Debug test environment
npm run test -- --verbose
```

### 📞 **Getting Help**
- 📖 **Documentation**: Check the `/testing/README.md` for detailed testing info
- 🐛 **Issues**: Report bugs in the GitHub issues section
- 💬 **Discussions**: Join community discussions
- 📧 **Contact**: Reach out to the development team

## 📈 Future Enhancements

### 🔮 **Planned Features**
- 🎨 **Custom Themes**: User-created color schemes
- 📊 **Analytics Dashboard**: Usage metrics and insights
- 🔔 **Push Notifications**: Real-time content updates
- 🌍 **Internationalization**: Multi-language support
- 📱 **PWA Features**: Offline functionality
- 🤖 **AI Recommendations**: Personalized content suggestions

### 🛠️ **Technical Improvements**
- ⚡ **Performance**: Further optimization and caching
- 🧪 **Testing**: Increase coverage to 90%+
- ♿ **Accessibility**: Enhanced accessibility features
- 🔒 **Security**: Additional security measures
- 📱 **Mobile**: Enhanced mobile experience
- 🌐 **SEO**: Search engine optimization

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Personalized Dashboard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### 👥 **How to Contribute**
1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔀 Open a Pull Request

### 📋 **Development Guidelines**
- ✅ Follow TypeScript best practices
- 🧪 Write tests for new features
- 📝 Update documentation
- 🎨 Follow the existing code style
- 🔍 Run linting before submitting

---

## 🎉 Acknowledgments

- 🙏 **Next.js Team** - For the amazing React framework
- 🎨 **Tailwind CSS** - For the utility-first CSS framework
- 🗃️ **Redux Toolkit** - For simplified state management
- 🧪 **Testing Library** - For simple and complete testing utilities
- 📰 **News API** - For providing news data
- 🎬 **OMDB API** - For movie information
- 👥 **Open Source Community** - For inspiration and contributions

---

<div align="center">

### 🚀 **Ready to build something amazing?**

**Star ⭐ this repo if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/your-username/personalised-dashboard?style=social)](https://github.com/your-username/personalised-dashboard)
[![GitHub forks](https://img.shields.io/github/forks/your-username/personalised-dashboard?style=social)](https://github.com/your-username/personalised-dashboard/fork)

</div>
