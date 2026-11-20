import { factories } from '@strapi/strapi';

// The public site may only submit inquiries. Reading them is admin-only.
export default factories.createCoreRouter('api::inquiry.inquiry', {
  only: ['create'],
});
