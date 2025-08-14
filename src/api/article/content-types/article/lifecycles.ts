export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    validateArticleData(data);
  },

  async beforeUpdate(event: any) {
    const { data } = event.params;
    if (data) {
      validateArticleData(data);
    }
  },
};

function validateArticleData(data: any) {
  // Validate content length
  if (data.content && data.content.length < 1000) {
    throw new Error('Article content must be at least 1000 characters long');
  }

  // Validate section and section_meta relationship
  if (data.section) {
    validateSectionMeta(data);
  }
}

function validateSectionMeta(data: any) {
  const hasInsightsMeta = data.section_meta && 
    Array.isArray(data.section_meta) && 
    data.section_meta.some((item: any) => 
      item.__component === 'shared.insights-meta'
    );

  if (data.section === 'insights') {
    // Insights section must have exactly one insights-meta component
    if (!hasInsightsMeta) {
      throw new Error('Articles in the insights section must include article type and subject metadata');
    }
    
    const insightsMetaCount = data.section_meta.filter((item: any) => 
      item.__component === 'shared.insights-meta'
    ).length;
    
    if (insightsMetaCount !== 1) {
      throw new Error('Articles in the insights section must have exactly one insights metadata component');
    }
    
    // Validate that required fields are present in the insights-meta component
    const insightsMeta = data.section_meta.find((item: any) => 
      item.__component === 'shared.insights-meta'
    );
    
    if (!insightsMeta.article_type) {
      throw new Error('Article type is required for insights articles');
    }
    
    if (!insightsMeta.subject) {
      throw new Error('Subject is required for insights articles');
    }
  } else {
    // Non-insights sections should not have insights-meta
    if (hasInsightsMeta) {
      throw new Error(`Articles in the ${data.section} section should not have insights metadata. This is only for insights articles.`);
    }
  }
}