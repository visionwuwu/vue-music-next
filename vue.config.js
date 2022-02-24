const registerRouter = require('./backend/router')
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import '@/assets/scss/variable.scss';
          @import '@/assets/scss/mixin.scss';
        `
      }
    }
  },
  devServer: {
    before(app) {
      registerRouter(app)
    }
  }
}
