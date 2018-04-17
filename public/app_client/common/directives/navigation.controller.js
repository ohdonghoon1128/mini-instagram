(function() {
    angular
        .module('instagramApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['authentication', '$location', '$uibModal', '$window'];
    function navigationCtrl(authentication, $location, $uibModal, $window) {
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
                $window.location.assign(vm.currentPath);
                $window.reload();
            });
        };

        vm.register = function() {
            const uibModalInstance = $uibModal.open({
                templateUrl: '/app_client/registerModal/registerModal.view.html',
                controller: 'registerModalCtrl as vm'
            });

            uibModalInstance.result.then((data) => {        
                $window.location.assign(vm.currentPath);
                $window.reload();
            });
        };
    }
})();
