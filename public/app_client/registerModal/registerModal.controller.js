(function() {
    angular
        .module('instagramApp')
        .controller('registerModalCtrl', registerModalCtrl);

    registerModalCtrl.$inject = ['$uibModalInstance', 'authentication'];
    function registerModalCtrl($uibModalInstance, authentication) {
        const vm = this;

        vm.formData = {};

        vm.onSubmit = function() {
            vm.formError = '';

            //if user does not enter either userid and password, then show error message
            if(!vm.formData.userid || !vm.formData.email || !vm.formData.password) {
                vm.formError = 'userid, email and password are required!';
            } else if(vm.formData.password !== vm.confirmPassword) {
                vm.formError = 'Your password does not match each other.';
            } else if(vm.formData.userid.search(/^[A-Za-z][A-Za-z0-9_]*$/) < 0) {
                vm.formError = 'Your id start with alphabet character followed by alphabet or _ character';
            } else {
                //if userid nad password given, then try to login
                authentication.register(vm.formData)
                    .then((res) => {
                        //successfully registered
                        $uibModalInstance.close();
                    })
                    .then(null, (res) => {
                        //unsuccessful, because username or email already exist, or other reason
                        //show the error message to user
                        vm.formError = res.data.message;
                    });
            }
            return false;
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
