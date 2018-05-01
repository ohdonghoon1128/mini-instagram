(function() {
    angular
        .module('instagramApp')
        .controller('uploadPhotoModalCtrl', uploadPhotoModalCtrl);

    uploadPhotoModalCtrl.$inject = ['$scope', 'authentication', 'Upload', '$uibModalInstance'];
    function uploadPhotoModalCtrl($scope, authentication, Upload, $uibModalInstance) {
        const vm = this;

        vm.submit = function() {
            if($scope.form.file.$valid && $scope.file) {
                submit($scope.file);
            }
        }
        function submit(file) {
            vm.formError = '';

            Upload
                .upload({
                    url: '/api/photo/',
                    data: {photo: file},
                    headers: {
                        Authorization: authentication.getToken()
                    }
                })
                .then((res) => {
                    $uibModalInstance.close(res.data.photoUrl);
                })
                .then(null, (res) => {
                    vm.formError = 'Uploading Failed, Please try later.';
                    console.log(res.data.message);
                });
        }

        vm.modal = {
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        };
    }
})();
