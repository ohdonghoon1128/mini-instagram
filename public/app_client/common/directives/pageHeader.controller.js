(function() {
    angular
        .module('instagramApp')
        .controller('pageHeaderCtrl', pageHeaderCtrl);

    pageHeaderCtrl.$inject = ['$routeParams'];
    function pageHeaderCtrl($routeParams) {
        const vm = this;

        vm.thisPage = {
            userid = $routeParams.userid;
        };

        vm.thisPage.name = 'something';

        /*
            user.getInfoById($routeParams.userid)
                .then((res) => {
                    vm.thisPage
                })
                .then(null, (res) => {});
        */
    }
})();
