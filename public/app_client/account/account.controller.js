(function() {
    angular
        .module('instagramApp')
        .controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['authentication'];
    function accountCtrl(authentication) {
        const vm = this;
        vm.pageHeader = {
            title: 'Account',
        };
        vm.formData = {};

        vm.onSubmit = function() {
            vm.formError = '';
            vm.formSuccess = '';

            if(!vm.formData.password || !vm.formData.newPassword || !vm.formData.confirmNewPassword) {
                vm.formError = 'old password, new password and confirm new password are required';
            } else if(vm.formData.newPassword !== vm.formData.confirmNewPassword) {
                vm.formError = 'new password and confirm new password must be the same';
            } else {
                authentication.changePassword(vm.formData)
                    .then((res) => {
                        vm.formSuccess = 'Password successfully changed';
                    })
                    .then(null, (res) => {
                        vm.formError = res.data.message;
                    });
            }
            return false;
        }

        vm.deleteAccount = function() {};
    }
})();
