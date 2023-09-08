// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    testIsolation: false,
    baseUrl: 'http://localhost:3000',
    viewportHeight: 1000,
    viewportWidth: 1200,
    env: {
      login_url: '/login',
      signup_url: '/sign_up',
      dashboard: '/'
    }
  }
});
