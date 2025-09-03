/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Validate section is provided
    if (!data.section) {
      return ctx.badRequest('Section is required');
    }
    
    // Get section details
    const section = await strapi.entityService.findOne('api::section.section', data.section, {
      fields: ['slug']
    });
    
    if (!section) {
      return ctx.badRequest('Invalid section selected');
    }
    
    // Validation for insights section (Know How)
    if (section.slug === 'know-how' && !data.subject) {
      return ctx.badRequest('Subject is required for Know How articles');
    }
    
    // Clear subject for non-insights articles
    if (section.slug !== 'know-how') {
      data.subject = null;
    }
    
    // Validate content length
    if (data.content && data.content.length < 1000) {
      return ctx.badRequest('Article content must be at least 1000 characters long');
    }
    
    return super.create(ctx);
  },

  async update(ctx) {
    const { data } = ctx.request.body;
    
    if (data) {
      // If section is being updated, validate it
      if (data.section) {
        const section = await strapi.entityService.findOne('api::section.section', data.section, {
          fields: ['slug']
        });
        
        if (!section) {
          return ctx.badRequest('Invalid section selected');
        }
        
        // Validation for insights section (Know How)
        if (section.slug === 'know-how' && data.subject === null) {
          return ctx.badRequest('Subject is required for Know How articles');
        }
        
        // Clear subject for non-insights articles
        if (section.slug !== 'know-how') {
          data.subject = null;
        }
      }
      
      // Validate content length if content is being updated
      if (data.content && data.content.length < 1000) {
        return ctx.badRequest('Article content must be at least 1000 characters long');
      }
    }
    
    return super.update(ctx);
  },
}));