const axios = require('axios');
const jsdom = require('jsdom');
const slugify = require('slugify');

'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function getGameInfo(slug) {
  const { JSDOM } = jsdom;
  const body = await axios.get(`https://gog.com/game/${slug}`);
  const dom = new JSDOM(body.data);

  const description = dom.window.document.querySelector('.description')

  return {
    rating: 'BR0',
    short_description: description.textContent.slice(0, 160),
    description: description.innerHTML,
  }
}

async function getByName(name, entityName) {
  const item = await strapi.services[entityName].find({ name });
  return item.length ? item[0] : null;
}

async function create(name, entityName) {
  const item = await getByName(name, entityName);

  if (!item) {
    return await strapi.services[entityName].create({
      name,
      slug: slugify(name, { lower: true }),
    })
  }
}

async function createManyToManyData(products) {
  const developers = {};
  const publishers = {};
  const categories = {};
  const platforms = {};

  products.forEach(product => {
    const { developer, publisher, genres, supportedOperatingSystems } = product;

    genres && genres.forEach(item => {
      categories[item] = true;
    });
    supportedOperatingSystems && supportedOperatingSystems.forEach(item => {
      platforms[item] = true;
    });
    developers[developer] = true;
    publishers[publisher] = true;
  });

  return Promise.all([
    ...Object.keys(developers).map(developer => create(developer, 'developer')),
    ...Object.keys(publishers).map(publisher => create(publisher, 'publisher')),
    ...Object.keys(categories).map(category => create(category, 'category')),
    ...Object.keys(platforms).map(platform => create(platform, 'platform')),
  ]);
}

module.exports = {
  populate: async params => {
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
    const { data: { products } } = await axios.get(gogApiUrl);

    await createManyToManyData(products);
  }
};
