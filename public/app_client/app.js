(function() {
    angular
        .module('instagramApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload']);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app_client/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/setting/profile', {
                templateUrl: '/app_client/profile/profile.view.html',
                controller: 'profileCtrl',
                controllerAs: 'vm'
            })
            .when('/setting/account', {
                templateUrl: '/app_client/account/account.view.html',
                controller: 'accountCtrl',
                controllerAs: 'vm'
            })
            .when('/user/:userid', {
                templateUrl: '/app_client/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});

    }

    angular
        .module('instagramApp')
        .config(['$routeProvider', config]);
})();
