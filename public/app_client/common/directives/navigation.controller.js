(function() {
    angular
        .module('instagramApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['authentication', '$location', '$uibModal', '$window', '$route'];
    function navigationCtrl(authentication, $location, $uibModal, $window, $route) {
        const vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentPath = $location.path();
        vm.currentUser = authentication.currentUser();

        vm.logout = function() {
            authentication.logout();
            $window.location.assign('/');
            $window.reload();
        };

        vm.login = function() {
            const uibModalInstance = $uibModal.open({
                templateUrl: '/app_client/loginModal/loginModal.view.html',
                controller: 'loginModalCtrl as vm'
            });

            uibModalInstance.result.then((data) => {        
                $route.reload();
            });
        };

        vm.register = function() {
            const uibModalInstance = $uibModal.open({
                templateUrl: '/app_client/registerModal/registerModal.view.html',
                controller: 'registerModalCtrl as vm'
            });

            uibModalInstance.result.then((data) => {
                $route.reload();
            });
        };
    }
})();
