import type { Core } from '@strapi/strapi';
import { promises as fs } from 'fs';
import path from 'path';

const docsRoot = (strapi: Core.Strapi) =>
  path.join(strapi.dirs.app.root, 'src', 'extensions', 'documentation', 'documentation');

const pickLatestVersion = async (root: string) => {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const versions = entries
    .filter(d => d.isDirectory() && /^(v)?\d+\.\d+\.\d+$/.test(d.name))
    .map(d => d.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return versions.at(-1);
};

const loadSpec = (root: string, version: string) =>
  fs.readFile(path.join(root, version, 'full_documentation.json'), 'utf8');

export default {
  async latest(ctx) {
    const root = docsRoot(strapi);
    const v = await pickLatestVersion(root);
    if (!v) return ctx.notFound('No documentation versions found');
    const json = await loadSpec(root, v);
    ctx.set('Content-Type', 'application/json');
    ctx.set('Cache-Control', 'public, max-age=300');
    ctx.body = json;
  },

  async byVersion(ctx) {
    const root = docsRoot(strapi);
    const { version } = ctx.params as { version: string };
    try {
      const json = await loadSpec(root, version);
      ctx.set('Content-Type', 'application/json');
      ctx.set('Cache-Control', 'public, max-age=300');
      ctx.body = json;
    } catch (err: any) {
      if (err?.code === 'ENOENT') return ctx.notFound('Unknown version');
      strapi.log.error('openapi.byVersion error', err);
      ctx.throw(500, 'Failed to read OpenAPI spec');
    }
  },
};