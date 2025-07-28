const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin("./i18n/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other Next.js configuration
};

module.exports = withNextIntl(nextConfig);
