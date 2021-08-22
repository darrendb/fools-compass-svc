'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    console.log(".../controllers/readings.findOne()");
    const { slug } = ctx.params;
    console.log(`  slug: ${slug}`);
    const entity = await strapi.services.readings.findOne({ slug });
    return sanitizeEntity(entity, { model: strapi.models.readings });
  },
};
