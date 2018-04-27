(function() {
    angular
        .module('instagramApp')
        .controller('pageHeaderCtrl', pageHeaderCtrl);

    pageHeaderCtrl.$inject = ['$routeParams', 'authentication', 'userData', '$uibModal', '$route'];
    function pageHeaderCtrl($routeParams, authentication, userData, $uibModal, $route) {
        const vm = this;

        vm.currentUser = authentication.currentUser();
        vm.isLoggedIn = authentication.isLoggedIn();

        vm.userid = $routeParams.userid;
/*
        vm.profile = {
            userid = $routeParams.userid,
        };
*/

        if(vm.isLoggedIn) {
            vm.popupUpload = upload;
        }
        if(vm.userid) {
            //if visiting a user's home page
            getUserInfo(vm.userid);
        }

        function upload() {
            const uibModalInstance = $uibModal.open({
                templateUrl: '/app_client/uploadPhotoModal/uploadPhotoModal.view.html',
                controller: 'uploadPhotoModalCtrl as vm'
            });

            uibModalInstance.result.then((data) => {
                $route.reload();
            });
        }

        function getUserInfo(userid) {
            userData.getUserInfoById(userid)
                .then((res) => {
                    vm.data = res.data;
                    console.log(res.data);
                })
                .then(null, (res) => {
                    console.log(res.data);
                });
        }
    }
})();
