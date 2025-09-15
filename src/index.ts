import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Auto-seed sections on startup
    try {
      const cfg = strapi.config.get("plugin::upload") as any; // <-- not 'plugin.upload'
      strapi.log.info(`Upload provider: ${cfg?.config?.provider}`);
      strapi.log.info(
        `Upload baseUrl: ${cfg?.config?.providerOptions?.baseUrl}`,
      );

      const count = await strapi.entityService.count("api::section.section");

      if (count === 0) {
        console.log("🌱 Seeding initial sections...");

        const sections: Array<{
          name: string;
          slug: string;
          order: number;
          path: "company" | "knowledge" | "platform" | "solutions";
        }> = [
          { name: "Platform", slug: "platform", order: 1, path: "platform" },
          { name: "Solutions", slug: "solutions", order: 2, path: "solutions" },
          { name: "Know How", slug: "knowledge", order: 3, path: "knowledge" },
          { name: "Company", slug: "company", order: 4, path: "company" },
        ];

        for (const section of sections) {
          await strapi.entityService.create("api::section.section", {
            data: section,
          });
          console.log(`✅ Created section: ${section.name}`);
        }

        console.log("🎉 Section seeding completed!");
      } else {
        console.log(`✅ Sections already exist (${count} found)`);
      }
    } catch (error) {
      console.error("❌ Error seeding sections:", error);
    }
  },
};
