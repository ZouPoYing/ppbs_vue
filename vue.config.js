module.exports = {
  configureWebpack: {
      resolve: {
          alias: {
              'src': '@',
              'assets': '@/assets',
              'common': '@/common',
              'components': '@/components',
              'store': '@/store',
              'views': '@/views',

          }
      }
  }
}
