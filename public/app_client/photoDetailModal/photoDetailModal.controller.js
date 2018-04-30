(function() {
    angular
        .module('instagramApp')
        .controller('photoDetailModalCtrl', photoDetailModalCtrl);

    photoDetailModalCtrl.$inject = ['$uibModalInstance', 'photoData', 'photoInfo', 'authentication'];
    function photoDetailModalCtrl($uibModalInstance, photoData, photoInfo, authentication) {
        const vm = this;
        vm.receivedData = {};
        vm.sendingData = {};

        vm.photoInfo = photoInfo;
        vm.photoInfo.name = 'delete';
        vm.isMyPhoto = authentication.currentUser().userid === photoInfo.ownerid;
        
        if(authentication.isLoggedIn()) {
            vm.addComment = function() {
                vm.formSuccess = '';
                vm.formError = '';

                if(!vm.sendingData.comment) {
                    return;
                } else if(typeof vm.sendingData.comment === 'string'){
                    vm.sendingData.comment = vm.sendingData.comment.trim().replace(/\s+/g, ' ');
                }

                photoData.addCommentById(vm.photoInfo.photoid, vm.sendingData.comment)
                    .then((res) => {
                        if(Array.isArray(vm.receivedData.comments)) {
                            vm.receivedData.comments.push(res.data.comment);
                        }
                    })
                    .then(null, (res) => {
                        vm.formError = res.data.message;
                    });
            };
        }

        photoData.getCommentsById(vm.photoInfo.photoid)
            .then((res) => {
                vm.receivedData.comments = res.data;
            })
            .then(null, (res) => {
                vm.formError = res.data.message;
            });

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

        vm.modal = {
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        };
    }
})();
