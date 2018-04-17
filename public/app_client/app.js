(function() {
    angular
        .module('instagramApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app_client/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            /*.when('/user/:userid', {
                templateUrl: '/user/user.view.html',
                controller: 'userCtrl',
                controllerAs: 'vm'
            })*/
            /*.when('/', {
                templateUrl: '',
                controller: '',
                controllerAs: 'vm'
            })*/
            /*.when('/', {
                templateUrl: '',
                controller: '',
                controllerAs: 'vm'
            })
            .when('/', {
                templateUrl: '',
                controller: '',
                controllerAs: 'vm'
            })
            .when('/auth/register', {
                templateUrl: '/auth/register/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/auth/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })*/
            .otherwise({redirectTo: '/'});

    }

    angular
        .module('instagramApp')
        .config(['$routeProvider', config]);
})();
