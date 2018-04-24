(function() {
    angular
        .module('instagramApp')
        .controller('uploadPhotoModalCtrl', uploadPhotoModalCtrl);

    uploadPhotoModalCtrl.$inject = ['$scope', 'authentication', 'Upload', '$uibModalInstance'];
    function uploadPhotoModalCtrl($scope, authentication, Upload, $uibModalInstance) {
        const vm = this;

        /*
        $scope.submit = function() {
            if($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        }
        */

        $scope.submit = function() {
            const file = $scope.file;
            Upload
                .upload({
                    url: '/api/photo/',
                    data: {photo: file},
                    headers: {
                        Authorization: authentication.getToken()
                    }
                })
                .then((res) => {
                    //res.data.id
                    $uibModalInstance.close(/**/);
                })
                .then(null, (res) => {
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
