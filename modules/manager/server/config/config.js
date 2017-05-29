module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/angular-flash-alert/dist/angular-flash.min.css',
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/css/main.css',
        'public/css/master.css',
        'public/css/styles.css',
        'public/lib/bootstrap-formhelpers/dist/css/bootstrap-formhelpers.css'
        // 'public/lib/bootstrap-formhelpers/dist/css/bootstrap-formhelpers.min.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-flash-alert/dist/angular-flash.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/jquery-ui/theme/start/jquery-ui.min.js',
        'public/lib/jquery-ui/jquery-ui.min.js',
        'modules/manager/client/lib/bootstrap-datepicker.js',
        'public/lib/bootstrap-formhelpers/js/bootstrap-formhelpers-timezones.js',
        'public/lib/bootstrap-formhelpers/js/bootstrap-formhelpers-states.js',
        'public/lib/bootstrap-formhelpers/js/bootstrap-formhelpers-countries.js',
        'public/lib/bootstrap-formhelpers/dist/js/bootstrap-formhelpers.js',
        // 'public/lib/bootstrap-formhelpers/dist/js/bootstrap-formhelpers.min.js',
        'public/lib/bootstrap-formhelpers/js/bootstrap-formhelpers-selectbox.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/manager/client/css/*.css'
    ],
    js: [
      'modules/manager/client/app/config.js',
      'modules/manager/client/app/init.js',
      'modules/manager/client/*.js',
      'modules/manager/client/**/*.js'
    ],
    views: ['modules/manager/client/views/**/*.html']
  },
  managerConfig: {
    'mongo_url': 'mongodb://localhost/trueapps',
    'db': 'trueapps'
  }
};
