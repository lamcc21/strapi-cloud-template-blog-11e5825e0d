/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Custom endpoint for navbar data - single API call to get articles grouped by section
  async getNavData(ctx) {
    try {
      const articles = await strapi.entityService.findMany('api::article.article', {
        populate: '*',
        filters: {
          publishedAt: { $notNull: true }, // Only published articles
        },
        sort: { createdAt: 'desc' },
        limit: 100, // Reasonable limit for navbar
      }) as any[];

      // Group articles by section
      const navData = articles.reduce((acc: any, article: any) => {
        const section = article.section || 'insights'; // Default fallback
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push({
          title: article.title,
          slug: article.slug,
        });
        return acc;
      }, {});

      // Ensure all sections exist even if empty
      const allSections = ['platform', 'solutions', 'insights', 'company'];
      allSections.forEach(section => {
        if (!navData[section]) {
          navData[section] = [];
        }
      });

      return { data: navData };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch navigation data');
    }
  },
}));