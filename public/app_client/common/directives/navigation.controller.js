(function() {
    angular
        .module('instagramApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = [/*'authentication', '$location',*/ '$uibModal'];
    function navigationCtrl(/*authentication, $location,*/ $uibModal) {
        const vm = this;
/*
        vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentPath = $location.path;
        vm.currentUser = authentication.currentUser();

        vm.logout = function() {
            authentication.logout();
            $location.path('/');
        };
*/
        vm.login = function() {
            const uibModalInstance = $uibModal.open({
                templateUrl: '/app_client/loginModal/loginModal.view.html',
                controller: 'loginModalCtrl as vm'
            });
        };

        vm.register = function() {
            const uibModalInstance = $uibModal.open({
                templateUrl: '/app_client/registerModal/registerModal.view.html',
                controller: 'registerModalCtrl as vm'
            });
        };
    }
})();
