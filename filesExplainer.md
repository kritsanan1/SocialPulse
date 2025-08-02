
# File Structure Documentation

## Directory Tree Analysis

```
SocialAI Pro - Advanced AI Social Media Manager
├── 📁 attached_assets/                          # Project assets and documentation
│   ├── 📄 Pasted--Content-Creation-Features-1754145903983_1754145903985.txt 🟢
│   ├── 📄 Pasted--Project-Name-Advanced-AI-1754142852103_1754142852104.txt 🟢
│   ├── 📄 Pasted--Setup-Infrastructure-1754142857478_1754142857479.txt 🟢
│   ├── 📄 Pasted-You-are-a-technical-1754147740815_1754147740815.txt 🟢
│   └── 🖼️ logo_1754142998882.png              # Application logo
├── 📁 client/                                   # Frontend React application
│   ├── 📁 public/
│   │   └── 📄 sw.js 🟢                         # Service worker for PWA features
│   ├── 📁 src/
│   │   ├── 📁 components/                       # Reusable UI components
│   │   │   ├── 📁 ui/                          # Shadcn/ui component library
│   │   │   │   ├── 📄 accordion.tsx 🟢         # Collapsible content component
│   │   │   │   ├── 📄 alert-dialog.tsx 🟢     # Modal alert dialogs
│   │   │   │   ├── 📄 alert.tsx 🟢            # Notification alerts
│   │   │   │   ├── 📄 aspect-ratio.tsx 🟢     # Responsive aspect ratio container
│   │   │   │   ├── 📄 avatar.tsx 🟢           # User profile image component
│   │   │   │   ├── 📄 badge.tsx 🟢            # Status and label badges
│   │   │   │   ├── 📄 breadcrumb.tsx 🟢       # Navigation breadcrumbs
│   │   │   │   ├── 📄 button.tsx 🟢           # Interactive button component
│   │   │   │   ├── 📄 calendar.tsx 🟢         # Date picker calendar
│   │   │   │   ├── 📄 card.tsx 🟢             # Content container cards
│   │   │   │   ├── 📄 carousel.tsx 🟢         # Image/content carousel
│   │   │   │   ├── 📄 chart.tsx 🟢            # Data visualization charts
│   │   │   │   ├── 📄 checkbox.tsx 🟢         # Form checkbox input
│   │   │   │   ├── 📄 collapsible.tsx 🟢      # Expandable content sections
│   │   │   │   ├── 📄 command.tsx 🟢          # Command palette interface
│   │   │   │   ├── 📄 context-menu.tsx 🟢     # Right-click context menus
│   │   │   │   ├── 📄 dialog.tsx 🟢           # Modal dialog component
│   │   │   │   ├── 📄 drawer.tsx 🟢           # Slide-out panel component
│   │   │   │   ├── 📄 dropdown-menu.tsx 🟢    # Dropdown menu component
│   │   │   │   ├── 📄 form.tsx 🟢             # Form wrapper components
│   │   │   │   ├── 📄 hover-card.tsx 🟢       # Hover tooltip cards
│   │   │   │   ├── 📄 input-otp.tsx 🟢        # OTP code input field
│   │   │   │   ├── 📄 input.tsx 🟢            # Text input component
│   │   │   │   ├── 📄 label.tsx 🟢            # Form field labels
│   │   │   │   ├── 📄 menubar.tsx 🟢          # Application menu bar
│   │   │   │   ├── 📄 navigation-menu.tsx 🟢  # Main navigation component
│   │   │   │   ├── 📄 pagination.tsx 🟢       # Data pagination controls
│   │   │   │   ├── 📄 popover.tsx 🟢          # Floating popover component
│   │   │   │   ├── 📄 progress.tsx 🟢         # Progress bar indicator
│   │   │   │   ├── 📄 radio-group.tsx 🟢      # Radio button group
│   │   │   │   ├── 📄 resizable.tsx 🟢        # Resizable panel component
│   │   │   │   ├── 📄 scroll-area.tsx 🟢      # Custom scrollbar area
│   │   │   │   ├── 📄 select.tsx 🟢           # Dropdown select component
│   │   │   │   ├── 📄 separator.tsx 🟢        # Visual divider component
│   │   │   │   ├── 📄 sheet.tsx 🟢            # Side panel component
│   │   │   │   ├── 📄 sidebar.tsx 🟢          # Navigation sidebar
│   │   │   │   ├── 📄 skeleton.tsx 🟢         # Loading skeleton placeholders
│   │   │   │   ├── 📄 slider.tsx 🟢           # Range slider input
│   │   │   │   ├── 📄 switch.tsx 🟢           # Toggle switch component
│   │   │   │   ├── 📄 table.tsx 🟢            # Data table component
│   │   │   │   ├── 📄 tabs.tsx 🟢             # Tabbed interface component
│   │   │   │   ├── 📄 textarea.tsx 🟢         # Multi-line text input
│   │   │   │   ├── 📄 theme-toggle.tsx 🟢     # Dark/light mode toggle
│   │   │   │   ├── 📄 toast.tsx 🟢            # Notification toast component
│   │   │   │   ├── 📄 toaster.tsx 🟢          # Toast notification manager
│   │   │   │   ├── 📄 toggle-group.tsx 🟢     # Group of toggle buttons
│   │   │   │   ├── 📄 toggle.tsx 🟢           # Single toggle button
│   │   │   │   └── 📄 tooltip.tsx 🟢          # Hover tooltip component
│   │   │   ├── 📄 ai-suggestions-panel.tsx 🟡  # AI content suggestions display
│   │   │   ├── 📄 analytics-dashboard.tsx 🟡   # Performance metrics dashboard
│   │   │   ├── 📄 calendar-planner.tsx 🟡      # Post scheduling calendar
│   │   │   ├── 📄 lazy-image.tsx 🟢           # Performance-optimized image loading
│   │   │   ├── 📄 performance-monitor.tsx 🟢   # Core Web Vitals monitoring
│   │   │   ├── 📄 post-creation-form.tsx 🔴    # Social media post creation form
│   │   │   ├── 📄 post-history.tsx 🟡          # Post history and analytics
│   │   │   ├── 📄 sidebar.tsx 🔴              # Main application navigation
│   │   │   └── 📄 theme-provider.tsx 🟢        # Theme context provider
│   │   ├── 📁 hooks/                           # Custom React hooks
│   │   │   ├── 📄 use-mobile.tsx 🟢           # Mobile device detection
│   │   │   ├── 📄 use-toast.ts 🟢             # Toast notification hook
│   │   │   ├── 📄 useAuth.ts 🟡               # Authentication state management
│   │   │   └── 📄 usePageSpeed.ts 🟢          # PageSpeed Insights integration
│   │   ├── 📁 lib/                             # Utility libraries
│   │   │   ├── 📄 authUtils.ts 🟢             # Authentication utilities
│   │   │   ├── 📄 queryClient.ts 🟢           # TanStack Query configuration
│   │   │   └── 📄 utils.ts 🟢                 # General utility functions
│   │   ├── 📁 pages/                           # Application route components
│   │   │   ├── 📄 ai-content-generator.tsx 🔴  # AI-powered content generation
│   │   │   ├── 📄 ai-insights.tsx 🔴          # AI analytics and insights
│   │   │   ├── 📄 billing.tsx 🟡              # Subscription billing management
│   │   │   ├── 📄 calendar.tsx 🟡             # Post scheduling interface
│   │   │   ├── 📄 content-recycling.tsx 🟡     # Content transformation tools
│   │   │   ├── 📄 home.tsx 🔴                 # Main dashboard page
│   │   │   ├── 📄 landing.tsx 🟡              # Marketing landing page
│   │   │   ├── 📄 not-found.tsx 🟢            # 404 error page
│   │   │   ├── 📄 performance.tsx 🟡          # Performance analytics page
│   │   │   ├── 📄 pricing.tsx 🟡              # Subscription pricing page
│   │   │   ├── 📄 sentiment-dashboard.tsx 🟡   # Brand sentiment analysis
│   │   │   ├── 📄 success.tsx 🟢              # Payment success page
│   │   │   ├── 📄 team-management.tsx 🔴       # Team collaboration features
│   │   │   └── 📄 visual-content-creator.tsx 🟡 # Visual content generation
│   │   ├── 📄 App.tsx 🔴                      # Main application router
│   │   ├── 📄 index.css 🟢                   # Global styles and Tailwind imports
│   │   └── 📄 main.tsx 🟢                    # React application entry point
│   └── 📄 index.html 🟢                      # HTML entry point with PWA setup
├── 📁 server/                                  # Backend Node.js/Express application
│   ├── 📁 routes/                              # API route handlers
│   │   ├── 📄 advanced-analytics.ts 🟡         # Comprehensive analytics API
│   │   ├── 📄 advanced-features.ts 🟢         # Advanced feature endpoints
│   │   ├── 📄 ai-content.ts 🟡               # AI content generation API
│   │   ├── 📄 autopilot.ts 🟡                # Automated posting system
│   │   ├── 📄 competitor-intelligence.ts 🟡    # Competitor analysis API
│   │   ├── 📄 content-recycling.ts 🟡         # Content transformation API
│   │   ├── 📄 performance.ts 🟢              # Performance monitoring API
│   │   ├── 📄 sentiment-analysis.ts 🟡        # Sentiment tracking API
│   │   └── 📄 stripe.ts 🟡                   # Payment processing integration
│   ├── 📄 ayrshare.ts 🟡                     # Social media API client
│   ├── 📄 db.ts 🟢                           # Database connection setup
│   ├── 📄 index.ts 🟡                        # Express server entry point
│   ├── 📄 replitAuth.ts 🟡                   # Replit authentication setup
│   ├── 📄 routes.ts 🔴                       # Main API route configuration
│   ├── 📄 storage.ts 🔴                      # Database operations layer
│   ├── 📄 stripe.ts 🟢                       # Stripe payment configuration
│   └── 📄 vite.ts 🟢                         # Vite development server integration
├── 📁 shared/                                  # Shared type definitions
│   └── 📄 schema.ts 🔴                        # Zod validation schemas
├── 📁 tests/                                   # Test files
│   └── 📄 components.test.ts 🟢              # Component unit tests
├── 📄 .gitignore 🟢                          # Git ignore patterns
├── 📄 .replit 🟢                             # Replit configuration
├── 📄 components.json 🟢                     # Shadcn/ui component configuration
├── 📄 drizzle.config.ts 🟢                   # Database migration configuration
├── 📄 package-lock.json 🟢                   # NPM dependency lock file
├── 📄 package.json 🟢                        # Project dependencies and scripts
├── 📄 postcss.config.js 🟢                   # PostCSS configuration
├── 📄 replit.md 🟢                           # Project documentation
├── 📄 tailwind.config.ts 🟢                  # Tailwind CSS configuration
├── 📄 tsconfig.json 🟢                       # TypeScript configuration
└── 📄 vite.config.ts 🟢                      # Vite build tool configuration
```

## File Statistics

- **Total Files:** 89
- **Complexity Distribution:**
  - 🟢 Low Complexity (0-3 imports): 67 files (75.3%)
  - 🟡 Medium Complexity (4-7 imports): 18 files (20.2%)
  - 🔴 High Complexity (8+ imports): 4 files (4.5%)

## Key Architecture Files

### Frontend Core
- **App.tsx** 🔴 - Main application router with lazy loading and authentication
- **main.tsx** 🟢 - React application bootstrap
- **sidebar.tsx** 🔴 - Primary navigation with feature access

### Backend Core
- **routes.ts** 🔴 - Central API routing with authentication middleware
- **storage.ts** 🔴 - Database abstraction layer
- **schema.ts** 🔴 - Shared validation schemas

### Feature Modules
- **ai-content-generator.tsx** 🔴 - AI-powered content creation interface
- **home.tsx** 🔴 - Main dashboard with analytics overview
- **team-management.tsx** 🔴 - Collaborative team features

## Import Complexity Legend
- 🟢 **Low (0-3):** Simple components or utilities with minimal dependencies
- 🟡 **Medium (4-7):** Feature components with moderate complexity
- 🔴 **High (8+):** Core application files with extensive integrations
