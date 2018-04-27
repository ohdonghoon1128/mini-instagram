(function() {
    angular
        .module('instagramApp')
        .controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['authentication', '$location'];
    function accountCtrl(authentication, $location) {
        const vm = this;
        vm.currentPage = {
            title: 'Account'
        };
        vm.formData = {};
        vm.currentUser = authentication.currentUser();

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

        authentication.getAccessLevel(vm.currentUser.userid)
            .then((res) => {
                vm.getAccessLevel = res.data.isPrivate ? 'Private' : 'Public'
            })
            .then(null, (res) => {
                vm.formError = res.data.message;
            });

        vm.changeAccessLevel = function() {
            vm.formError = '';
            vm.formSuccess = '';

            if(!vm.isPrivate) {
                vm.formError = 'Please choose either Public or Private';
            } else {
                authentication.changeAccessLevel(vm.isPrivate)
                    .then((res) => {
                        vm.getAccessLevel = res.data.isPrivate ? 'Private' : 'Public';
                        vm.formSuccess = 'You access level changed successfully';
                    })
                    .then(null, (res) => {
                        vm.formError = res.data.message;
                    });
            }
        };

        vm.deleteAccount = function() {
            vm.formSuccess = '';
            vm.formError = '';
            if(!vm.deletePassword) {
                vm.formError = 'Please provide your password to delete your account';
                return false;
            }

            authentication.deleteAccount(vm.deletePassword)
                .then((res) => {
                    authentication.logout();
                    $location.path('/');
                })
                .then(null, (res) => {
                    vm.formError = res.data.message;
                });
        };
    }
})();
