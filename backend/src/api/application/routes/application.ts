import { factories } from '@strapi/strapi';

// The public site may only submit applications. Reading them is admin-only.
export default factories.createCoreRouter('api::application.application', {
  only: ['create'],
});
