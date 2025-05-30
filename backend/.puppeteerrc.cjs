const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Cache directory for better performance
  cacheDirectory: join(__dirname, 'node_modules', '.puppeteer_cache'),
  
  // Use Chrome for Testing (default in v24.x)
  browserRevision: 'latest',
  
  // Skip download if using system Chrome
  skipDownload: false,
  
  // Default launch options
  defaultProduct: 'chrome',
  
  // Experimental features
  experiments: {
    macArmChromiumEnabled: true
  }
}; 