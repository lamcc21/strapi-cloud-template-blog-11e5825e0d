/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // If section is provided, validate it
    if (data.section) {
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
    } else {
      // Standalone articles don't have sections - clear subject
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
      if (data.section !== undefined) {
        if (data.section) {
          // Section is being set to a value
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
        } else {
          // Section is being cleared (set to null) - make it standalone
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