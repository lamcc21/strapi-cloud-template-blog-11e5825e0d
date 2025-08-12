export default {
  routes: [
    {
      method: 'GET',
      path: '/openapi.json',
      handler: 'openapi.latest',
      // config: { policies: ['global::require-docs-token'] },
    },
    {
      method: 'GET',
      path: '/openapi/:version/openapi.json',
      handler: 'openapi.byVersion',
      // config: { policies: ['global::require-docs-token'] },
    },
  ],
};