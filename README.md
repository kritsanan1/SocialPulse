
# SocialAI Pro - Advanced AI Social Media Manager

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)

A comprehensive web application that leverages AI to manage, schedule, and analyze social media posts across multiple platforms. Features AI-driven content suggestions, automated post optimization, customizable dashboards, and collaborative team management.

## 🚀 Features

### Core Functionality
- **Multi-Platform Posting** - Twitter, Facebook, Instagram, LinkedIn, TikTok, Pinterest, Snapchat
- **AI Content Generation** - Smart content creation based on trending topics
- **Visual Content Creator** - AI-powered image and video content tools
- **Content Recycling Engine** - Transform old content into new formats
- **Smart Scheduling** - AI-optimized posting times

### Analytics & Intelligence
- **Advanced Analytics** - Deep insights and performance tracking
- **Sentiment Analysis** - Track brand sentiment across platforms
- **Competitor Intelligence** - Monitor competitor activity
- **AI Insights** - Performance recommendations and optimization tips

### Team & Collaboration
- **Team Management** - Role-based access and collaboration
- **Auto-Pilot Mode** - Automated content curation and posting
- **Performance Monitoring** - Core Web Vitals and PageSpeed optimization

## 📋 Technical Requirements

### Development Environment
- **Node.js:** 18.x or higher
- **NPM:** 8.x or higher
- **TypeScript:** 5.6.3
- **React:** 18.3.x

### System Dependencies
- **Operating System:** Linux, macOS, or Windows 10+
- **Memory:** 4GB RAM minimum, 8GB recommended
- **Storage:** 2GB free space
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Database
- **PostgreSQL:** 14.x or higher
- **Connection:** Neon serverless or local PostgreSQL instance

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:5432/database"
POSTGRES_PRISMA_URL="postgresql://username:password@hostname:5432/database"
POSTGRES_URL_NON_POOLING="postgresql://username:password@hostname:5432/database"

# Authentication
REPLIT_DB_URL="your_replit_db_url"
SESSION_SECRET="your_secure_session_secret_min_32_chars"

# Social Media APIs
AYRSHARE_API_KEY="your_ayrshare_api_key"

# Payment Processing
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# AI Services (Optional)
OPENAI_API_KEY="your_openai_api_key"

# Performance Monitoring
GOOGLE_PAGESPEED_API_KEY="your_pagespeed_api_key"

# Application Configuration
NODE_ENV="development"
PORT="5000"
```

### Environment Variable Descriptions

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Session encryption key (32+ chars) | ✅ | `your-super-secure-session-secret-key` |
| `AYRSHARE_API_KEY` | Social media posting API key | ✅ | `ayr_live_xyz123...` |
| `STRIPE_SECRET_KEY` | Stripe payment processing key | ✅ | `sk_test_xyz123...` |
| `OPENAI_API_KEY` | OpenAI API for AI features | ❌ | `sk-xyz123...` |
| `GOOGLE_PAGESPEED_API_KEY` | PageSpeed Insights API | ❌ | `AIzaSyXYZ123...` |

## 🛠️ Installation Guide

### 1. Clone Repository
```bash
git clone <repository-url>
cd socialai-pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Push database schema
npm run db:push

# Verify database connection
npm run db:studio  # Opens Drizzle Studio
```

### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### 5. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Common Installation Issues

#### Port Already in Use
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm run dev
```

#### Database Connection Issues
```bash
# Verify PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string format
echo $DATABASE_URL
```

#### Missing Dependencies
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 👥 Development Guidelines

### Code Style Conventions

#### TypeScript Standards
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Implement proper error handling with try-catch blocks
- Use meaningful variable and function names

#### React Best Practices
- Functional components with hooks
- Custom hooks for reusable logic
- Proper dependency arrays in useEffect
- Memoization for expensive computations

#### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/         # Route-specific components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── types/         # TypeScript type definitions
```

### Git Workflow

#### Branch Naming Convention
```
[type]/[ticket-number]-[description]

Examples:
feature/SOC-123-ai-content-generator
bugfix/SOC-456-authentication-redirect
hotfix/SOC-789-payment-processing
docs/SOC-101-api-documentation
```

#### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add social login integration
fix(api): resolve payment webhook timeout
docs(readme): update installation instructions
style(ui): improve button component styling
```

### Pull Request Template

```markdown
## Changes Made
- [ ] Feature implementation
- [ ] Bug fixes
- [ ] Documentation updates
- [ ] Performance improvements

## Testing Steps
1. [ ] Unit tests passing
2. [ ] Integration tests verified
3. [ ] Manual testing completed
4. [ ] Cross-browser compatibility checked

## Screenshots/Videos
[Add relevant screenshots or screen recordings]

## Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests cover new functionality
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact assessed
```

### Code Review Criteria

#### Security Checklist
- [ ] No hardcoded secrets or API keys
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection measures
- [ ] Authentication/authorization checks

#### Performance Standards
- [ ] Bundle size impact analyzed
- [ ] Database queries optimized
- [ ] Caching strategies implemented
- [ ] Core Web Vitals maintained
- [ ] Lazy loading for heavy components

## 🚀 Deployment Process

### Replit Deployment

#### 1. Environment Setup
```bash
# Configure production environment variables
replit secrets set DATABASE_URL "your_production_db_url"
replit secrets set STRIPE_SECRET_KEY "sk_live_your_key"
```

#### 2. Build Configuration
```bash
# Build for production
npm run build

# Verify build output
ls -la dist/
```

#### 3. Deployment Steps
1. **Configure Deployment Settings**
   - Go to Replit Deployments tab
   - Set build command: `npm run build`
   - Set run command: `npm start`

2. **Deploy Application**
   - Click "Deploy" button
   - Monitor deployment logs
   - Verify application functionality

#### 4. Post-Deployment Verification
- [ ] Application loads correctly
- [ ] Database connections working
- [ ] Payment processing functional
- [ ] API endpoints responding
- [ ] Authentication flow working

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/socialai_dev
STRIPE_SECRET_KEY=sk_test_...
```

#### Production
```bash
NODE_ENV=production
DATABASE_URL=postgresql://production-host:5432/socialai_prod
STRIPE_SECRET_KEY=sk_live_...
```

### Rollback Procedures

#### Quick Rollback
1. Access Replit Deployments dashboard
2. Select previous stable deployment
3. Click "Promote to Production"
4. Verify application functionality

#### Database Rollback (if needed)
```bash
# Backup current database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from previous backup
psql $DATABASE_URL < backup_previous.sql
```

### Emergency Protocols

#### Application Down
1. **Immediate Response**
   - Check Replit deployment status
   - Verify database connectivity
   - Review recent changes

2. **Escalation Process**
   - Notify team via designated channels
   - Document incident details
   - Implement temporary fixes

3. **Recovery Steps**
   - Roll back to last known good state
   - Apply hotfixes if necessary
   - Monitor application stability

## 📊 Performance Monitoring

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Monitoring Tools
- Built-in Performance Monitor component
- Google PageSpeed Insights integration
- Custom analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch following naming conventions
3. Implement changes with proper testing
4. Submit pull request with detailed description
5. Address code review feedback
6. Merge after approval

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Refer to the troubleshooting documentation

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Maintainers:** Development Team
