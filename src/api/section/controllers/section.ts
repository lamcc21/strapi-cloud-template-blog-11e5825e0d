/**
 * section controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::section.section', ({ strapi }) => ({
  async create(ctx) {
    const count = await strapi.entityService.count('api::section.section');
    
    if (count >= 4) {
      return ctx.badRequest('Maximum of 4 sections allowed. You can edit existing sections instead.');
    }
    
    return super.create(ctx);
  },
  
  async delete(ctx) {
    const count = await strapi.entityService.count('api::section.section');
    
    if (count <= 4) {
      return ctx.badRequest('Cannot delete core sections. Minimum 4 sections required.');
    }
    
    const { id } = ctx.params;
    // Check if section has articles
    const articlesCount = await strapi.entityService.count('api::article.article', {
      filters: { section: id }
    });
    
    if (articlesCount > 0) {
      return ctx.badRequest('Cannot delete section with existing articles. Please reassign or delete articles first.');
    }
    
    return super.delete(ctx);
  }
}));