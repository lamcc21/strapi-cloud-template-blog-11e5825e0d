/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Simple validation for insights articles
    if (data.section === 'insights' && !data.subject) {
      return ctx.badRequest('Subject is required for insights articles');
    }
    
    // Clear subject for non-insights articles
    if (data.section !== 'insights') {
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
      // Simple validation for insights articles
      if (data.section === 'insights' && data.subject === null) {
        return ctx.badRequest('Subject is required for insights articles');
      }
      
      // Clear subject for non-insights articles
      if (data.section && data.section !== 'insights') {
        data.subject = null;
      }
      
      // Validate content length if content is being updated
      if (data.content && data.content.length < 1000) {
        return ctx.badRequest('Article content must be at least 1000 characters long');
      }
    }
    
    return super.update(ctx);
  },
}));