# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run develop` - Start development server with autoReload enabled
- `npm run start` - Start production server with autoReload disabled  
- `npm run build` - Build the admin panel for production
- `npm run deploy` - Deploy to Strapi Cloud
- `npm run seed:example` - Seed the database with example data (articles, authors, categories)

### Database Seeding
The project includes a comprehensive seeding system in `scripts/seed.js`. The seed script:
- Only runs on first launch (tracks via plugin store)
- Creates sample blog content (articles, authors, categories, global settings, about page)
- Handles file uploads for images and media
- Sets up public permissions for content types
- Can be run manually via `npm run seed:example`

## Architecture Overview

This is a **Strapi v5 headless CMS** configured as a blog template with:

### Content Architecture
- **Articles**: Blog posts with dynamic content blocks, cover images, author/category relations
- **Authors**: Writer profiles with avatars and biographical info
- **Categories**: Content classification system
- **Global**: Site-wide settings including SEO defaults and favicon
- **About**: Static about page with dynamic content blocks

### Dynamic Content System
Uses Strapi's **dynamic zones** for flexible content blocks:
- `shared.media` - Single file/image/video uploads
- `shared.quote` - Quote blocks for testimonials
- `shared.rich-text` - WYSIWYG content areas  
- `shared.slider` - Multi-image carousels

### Database Configuration
- **Default**: SQLite (file-based, stored in `.tmp/data.db`)
- **Production**: Supports MySQL and PostgreSQL via environment variables
- **Environment-driven**: All database settings configurable via ENV vars

### File Structure
- `src/api/` - Content type definitions (articles, authors, categories, etc.)
- `src/components/shared/` - Reusable content components for dynamic zones
- `config/` - Strapi configuration (database, plugins, middleware)
- `data/` - Seed data and example uploads
- `scripts/seed.js` - Database seeding logic

### Bootstrap Process
The application runs a bootstrap function on startup (`src/bootstrap.js`) that:
- Automatically seeds the database on first run
- Sets up content permissions
- Handles file uploads for example content

### Key Relationships
- Articles → Authors (many-to-one)
- Articles → Categories (many-to-one)  
- Articles → Dynamic Blocks (one-to-many via dynamic zone)
- All content types support draft/publish workflow

## Node Requirements
- Node.js: 18.0.0 - 22.x.x
- npm: >=6.0.0