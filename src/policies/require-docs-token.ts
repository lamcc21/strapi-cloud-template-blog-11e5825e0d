import type { Core } from '@strapi/strapi';

export default (policyContext: Core.PolicyContext) => {
  const expected = process.env.DOCS_TOKEN;
  const got = policyContext.request.header['x-docs-token'];
  return Boolean(expected && got && got === expected);
};