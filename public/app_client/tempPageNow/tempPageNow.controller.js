(function() {
    angular
        .module('instagramApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$http', 'authentication', '$routeParams'];
    function homeCtrl($http, authentication, $routeParams) {
        const vm = this;

        vm.pageHeader = {
            title: 'mini-instagram'
        };
        vm.currentPath = $routeParams.userid;

        http

        /*
            test data
        */
        vm.data = {
            photos: [
                'test/pic-1.jpg',
                'test/pic-2.jpg',
                'test/pic-3.jpg',
                'test/pic-4.jpg',
                'test/pic-5.jpg',
                'test/pic-6.jpg',
                'test/pic-7.jpg'
            ]
        }
    }
})();