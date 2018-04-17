(function() {
    angular
        .module('instagramApp')
        .controller('loginModalCtrl', loginModalCtrl);

    loginModalCtrl.$inject = ['$uibModalInstance', 'authentication'];
    function loginModalCtrl($uibModalInstance, authentication) {
        const vm = this;

        vm.formData = {};

        vm.onSubmit = function() {
            vm.formError = '';

            //if user does not enter either userid and password, then show error message
            if(!vm.formData.userid || !vm.formData.password) {
                vm.formError = 'userid and password are required!';
                return false;
            } else {
                //if userid nad password given, then try to login
                authentication.login(vm.formData)
                    .then((res) => {
                        //successfully login
                        $uibModalInstance.close();
                    })
                    .then(null, (res) => {
                        //unsuccessful, because incorrect username or password, or other reason
                        //show the error message to user
                        vm.formError = res.data.message;
                    });

                return false;
            }
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
