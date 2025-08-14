/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Validate section and section_meta relationship
    const validationError = validateSectionMeta(data);
    if (validationError) {
      return ctx.badRequest(validationError);
    }
    
    // Validate content length
    if (data.content && data.content.length < 1000) {
      return ctx.badRequest('Article content must be at least 1000 characters long');
    }
    
    // Call the default create method
    return super.create(ctx);
  },

  async update(ctx) {
    const { data } = ctx.request.body;
    
    // Validate section and section_meta relationship
    const validationError = validateSectionMeta(data);
    if (validationError) {
      return ctx.badRequest(validationError);
    }
    
    // Validate content length if content is being updated
    if (data.content && data.content.length < 1000) {
      return ctx.badRequest('Article content must be at least 1000 characters long');
    }
    
    // Call the default update method
    return super.update(ctx);
  }
}));

function validateSectionMeta(data: any): string | null {
  // Skip validation if section is not being set/updated
  if (!data.section) {
    return null;
  }
  
  const hasInsightsMeta = data.section_meta && 
    Array.isArray(data.section_meta) && 
    data.section_meta.some((item: any) => 
      item.__component === 'shared.insights-meta'
    );
  
  if (data.section === 'insights') {
    // Insights section must have exactly one insights-meta component
    if (!hasInsightsMeta) {
      return 'Articles in the insights section must include article type and subject metadata';
    }
    
    const insightsMetaCount = data.section_meta.filter((item: any) => 
      item.__component === 'shared.insights-meta'
    ).length;
    
    if (insightsMetaCount !== 1) {
      return 'Articles in the insights section must have exactly one insights metadata component';
    }
    
    // Validate that article_type is present in the insights-meta component
    const insightsMeta = data.section_meta.find((item: any) => 
      item.__component === 'shared.insights-meta'
    );
    
    if (!insightsMeta.article_type) {
      return 'Article type is required for insights articles';
    }
  } else {
    // Non-insights sections should not have insights-meta
    if (hasInsightsMeta) {
      return `Articles in the ${data.section} section should not have insights metadata. This is only for insights articles.`;
    }
  }
  
  return null;
}