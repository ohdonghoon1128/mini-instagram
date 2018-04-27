(function() {
    angular
        .module('instagramApp')
        .controller('photoDetailModalCtrl', photoDetailModalCtrl);

    photoDetailModalCtrl.$inject = ['$uibModalInstance', 'photoData', 'photoInfo', 'authentication'];
    function photoDetailModalCtrl($uibModalInstance, photoData, photoInfo, authentication) {
        const vm = this;

        vm.photoInfo = photoInfo;
        vm.photoInfo.name = 'delete';
        vm.isMyPhoto = authentication.currentUser().userid === photoInfo.ownerid;

        vm.onDelete = function() {
            vm.formSuccess= '';
            vm.formError = '';
            if(vm.confirmPhotoName !== vm.photoInfo.name) {
                vm.formError = `Please type ${vm.photoInfo.name} to confirm`;
            } else {
                photoData.deletePhotoById(vm.photoInfo.photoid)
                    .then((res) => {
                        $uibModalInstance.close();
                    })
                    .then(null, (res) => {
                        vm.formError = res.data.message;
                    });
            }
        }
    }
})();
