
# Scripts Documentation

This document provides detailed information about all available npm scripts for the SocialAI Pro application.

## Script Reference Table

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Start development server with hot reload | None | `npm run dev` | **Port in use:** Kill process with `sudo lsof -ti:5000 \| xargs kill -9`<br>**Module errors:** Run `npm install` to update dependencies |
| `build` | Build application for production | None | `npm run build` | **Build fails:** Check TypeScript errors with `npm run check`<br>**Memory issues:** Increase Node.js memory with `NODE_OPTIONS="--max-old-space-size=4096" npm run build` |
| `start` | Start production server | None | `npm start` | **Server won't start:** Verify build output exists with `ls dist/`<br>**Environment errors:** Check all required env vars are set |
| `check` | Run TypeScript type checking | None | `npm run check` | **Type errors:** Review TypeScript configuration in `tsconfig.json`<br>**Module resolution:** Verify import paths and installed types |
| `db:push` | Push database schema changes | None | `npm run db:push` | **Connection failed:** Verify `DATABASE_URL` environment variable<br>**Schema conflicts:** Backup database before pushing changes |

## Detailed Script Descriptions

### Development Scripts

#### `npm run dev`
**Purpose:** Starts the development server with hot module replacement (HMR) and file watching.

**What it does:**
- Launches Express server on port 5000
- Enables Vite development server for frontend
- Watches for file changes and auto-reloads
- Provides source maps for debugging
- Enables React Fast Refresh

**Expected Output:**
```bash
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

Advanced features not available
Stripe features not available
AI Content features not available
3:13:48 PM [express] serving on port 5000
```

**Environment Variables Required:**
- `NODE_ENV=development`
- `DATABASE_URL`
- `SESSION_SECRET`

**Common Issues:**
- **Port 5000 already in use:**
  ```bash
  # Find and kill process
  sudo lsof -ti:5000 | xargs kill -9
  
  # Alternative: Use different port
  PORT=3001 npm run dev
  ```

- **Module resolution errors:**
  ```bash
  # Clear node_modules and reinstall
  rm -rf node_modules package-lock.json
  npm install
  ```

- **Database connection fails:**
  ```bash
  # Test database connection
  psql $DATABASE_URL -c "SELECT 1;"
  
  # Verify environment variables
  echo $DATABASE_URL
  ```

### Build Scripts

#### `npm run build`
**Purpose:** Creates optimized production build of the application.

**Process:**
1. Builds frontend with Vite (client assets)
2. Compiles backend TypeScript with esbuild
3. Optimizes assets (minification, tree-shaking)
4. Generates source maps for production debugging

**Output Structure:**
```
dist/
├── index.js           # Compiled server entry point
├── assets/            # Frontend static assets
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── public/            # Static files
```

**Expected Output:**
```bash
> rest-express@1.0.0 build
> vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

✓ built in 2.34s
dist/index.js  1.2mb
```

**Performance Optimization:**
- **Bundle analysis:** Use `npm run build -- --analyze` to inspect bundle size
- **Memory issues:** Increase Node.js heap size:
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" npm run build
  ```

#### `npm start`
**Purpose:** Runs the production-built application.

**Prerequisites:**
- Must run `npm run build` first
- Production environment variables configured
- Database accessible from production environment

**Expected Output:**
```bash
> rest-express@1.0.0 start
> NODE_ENV=production node dist/index.js

[Production] Server starting on port 5000
[Production] Database connected
[Production] Application ready
```

**Production Checklist:**
- [ ] `NODE_ENV=production`
- [ ] All required environment variables set
- [ ] Database migrations applied
- [ ] SSL certificates configured (if applicable)
- [ ] Monitoring and logging enabled

### Quality Assurance Scripts

#### `npm run check`
**Purpose:** Performs TypeScript type checking across the entire codebase.

**Coverage:**
- Frontend React components
- Backend API routes
- Shared type definitions
- Configuration files

**Expected Output (Success):**
```bash
> rest-express@1.0.0 check
> tsc

# No output indicates successful type checking
```

**Expected Output (Errors):**
```bash
> rest-express@1.0.0 check
> tsc

src/components/sidebar.tsx(42,23): error TS2304: Cannot find name 'CheckCircle'.
src/pages/home.tsx(18,15): error TS2339: Property 'user' does not exist on type 'AuthState'.
```

**Common Type Errors:**
- **Missing imports:** Add missing import statements
- **Type mismatches:** Ensure data types match interface definitions
- **Unused variables:** Remove or prefix with underscore

### Database Scripts

#### `npm run db:push`
**Purpose:** Synchronizes database schema with Drizzle ORM definitions.

**What it does:**
- Reads schema definitions from `shared/schema.ts`
- Generates and executes SQL migrations
- Updates database structure to match code
- Preserves existing data during schema changes

**Expected Output:**
```bash
> rest-express@1.0.0 db:push
> drizzle-kit push

📦 Drizzle Kit v0.30.4
🔗 Pushing schema to database...
✅ Schema synchronized successfully
```

**Safety Considerations:**
- **Always backup before schema changes:**
  ```bash
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
  ```

- **Test in development first:**
  ```bash
  DATABASE_URL="postgresql://localhost:5432/socialai_dev" npm run db:push
  ```

- **Review generated migrations:**
  - Check for potential data loss
  - Verify foreign key relationships
  - Ensure indexes are preserved

## Custom Script Examples

### Development Workflow
```bash
# Start fresh development session
npm install                    # Install dependencies
npm run db:push               # Sync database schema
npm run check                 # Verify types
npm run dev                   # Start development server
```

### Production Deployment
```bash
# Build and deploy workflow
npm ci                        # Install exact dependencies
npm run check                 # Type check
npm run build                 # Build for production
npm start                     # Start production server
```

### Database Management
```bash
# Database maintenance workflow
pg_dump $DATABASE_URL > backup.sql    # Backup database
npm run db:push                        # Apply schema changes
psql $DATABASE_URL < seed.sql          # Seed test data (if needed)
```

## Performance Monitoring

### Build Performance
- **Monitor build times:** Track build duration trends
- **Bundle size analysis:** Use webpack-bundle-analyzer
- **Memory usage:** Monitor Node.js heap usage during builds

### Development Performance
- **Hot reload speed:** Time between file save and browser update
- **TypeScript compilation:** Monitor `tsc` performance
- **Database connection:** Track query response times

## Environment-Specific Configurations

### Development (.env.development)
```bash
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/socialai_dev
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production (.env.production)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://production-host:5432/socialai
VITE_API_BASE_URL=https://socialai-pro.replit.app/api
```

### Testing (.env.test)
```bash
NODE_ENV=test
DATABASE_URL=postgresql://localhost:5432/socialai_test
DISABLE_LOGGING=true
```

## Troubleshooting Matrix

| Error Type | Symptoms | Solution | Prevention |
|------------|----------|----------|------------|
| **Port Conflicts** | `EADDRINUSE: address already in use ::5000` | `sudo lsof -ti:5000 \| xargs kill -9` | Use different ports for multiple projects |
| **Memory Issues** | `JavaScript heap out of memory` | `NODE_OPTIONS="--max-old-space-size=4096"` | Monitor bundle size growth |
| **Type Errors** | `error TS2304: Cannot find name` | Add missing imports/types | Regular `npm run check` |
| **Database Errors** | `Connection terminated unexpectedly` | Check `DATABASE_URL` and network | Use connection pooling |
| **Build Failures** | `Module not found` errors | `rm -rf node_modules && npm install` | Lock dependency versions |

---

**Last Updated:** January 2025
**Maintainer:** Development Team
