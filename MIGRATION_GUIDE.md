# Article Schema Migration Guide

## Overview
This guide helps migrate existing articles to the new schema structure with section enum and Dynamic Zone for insights-specific metadata.

## Changes Made

### 1. New Fields
- **`section`** (required enum): Articles now must specify which section they belong to
  - Allowed values: `platform`, `solutions`, `insights`, `company`
  - Default: `insights`

- **`section_meta`** (Dynamic Zone): Container for section-specific metadata
  - Currently only allows `shared.insights-meta` component

### 2. Modified Fields
- **`slug`**: Now required
- **`cover`**: Now required, only accepts images (no videos/files)
- **`content`**: Now requires minimum 1000 characters

### 3. Removed Fields (moved to component)
- **`article_type`**: Moved to `shared.insights-meta` component
- **`subject`**: Moved to `shared.insights-meta` component

## Migration Steps for Existing Data

### Option 1: Manual Migration via Admin Panel
1. For each existing article:
   - Set `section` to `insights` (since all existing articles have article_type)
   - Add an `insights-meta` component to `section_meta`
   - Fill in the `article_type` and `subject` from the original values
   - Ensure cover image is present
   - Verify content length meets 1000 character minimum

### Option 2: Database Migration Script
```javascript
// migration-script.js
async function migrateArticles() {
  const articles = await strapi.entityService.findMany('api::article.article', {
    populate: ['subject'],
  });

  for (const article of articles) {
    const updateData = {
      section: 'insights', // All existing articles become insights
      section_meta: [
        {
          __component: 'shared.insights-meta',
          article_type: article.article_type || 'BLOGS',
          subject: article.subject?.id || null,
        }
      ],
      slug: article.slug || generateSlugFromTitle(article.title),
    };

    // Check content length
    if (article.content && article.content.length < 1000) {
      console.warn(`Article "${article.title}" has content less than 1000 characters`);
    }

    // Check for missing cover image
    if (!article.cover) {
      console.warn(`Article "${article.title}" is missing a cover image`);
    }

    await strapi.entityService.update('api::article.article', article.id, {
      data: updateData,
    });
  }
}
```

## Editor Guidelines

### Creating New Articles

1. **Select Section First**: Choose the appropriate section for your article
   - `insights`: Blog posts, news, thought leadership
   - `platform`: Platform feature documentation
   - `solutions`: Solution descriptions and case studies
   - `company`: Company updates and announcements

2. **For Insights Articles**:
   - After selecting "insights" section
   - Add one "Insights Meta" component to the Dynamic Zone
   - Select article type (BLOGS or NEWS)
   - Choose relevant subject/category

3. **For Other Sections**:
   - Simply select the section
   - Do NOT add any components to section_meta

### Validation Rules
- Cover image is mandatory for all articles
- Content must be at least 1000 characters
- Insights articles require article_type and can have subject
- Non-insights articles cannot have insights metadata

## API Changes

### Request Format for Insights Articles
```json
{
  "data": {
    "title": "My Article",
    "slug": "my-article",
    "section": "insights",
    "section_meta": [
      {
        "__component": "shared.insights-meta",
        "article_type": "BLOGS",
        "subject": 1
      }
    ],
    "content": "Article content here... (minimum 1000 characters)",
    "cover": 123,
    "publish_date": "2024-01-15"
  }
}
```

### Request Format for Platform/Solutions/Company Articles
```json
{
  "data": {
    "title": "Platform Feature",
    "slug": "platform-feature",
    "section": "platform",
    "section_meta": [],
    "content": "Article content here... (minimum 1000 characters)",
    "cover": 124,
    "publish_date": "2024-01-15"
  }
}
```

## Troubleshooting

### Common Errors
1. **"Article content must be at least 1000 characters long"**
   - Solution: Expand your article content to meet the minimum requirement

2. **"Articles in the insights section must include article type and subject metadata"**
   - Solution: Add an insights-meta component with required fields

3. **"Articles in the platform section should not have insights metadata"**
   - Solution: Remove insights-meta component for non-insights articles

## Rollback Plan
If needed, to rollback:
1. Restore the original Article schema from backup
2. Remove the `shared.insights-meta` component
3. Restore the original controller
4. Re-run Strapi build: `npm run build`