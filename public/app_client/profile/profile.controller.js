(function() {
    angular
        .module('instagramApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['authentication', 'userData'];
    function profileCtrl(authentication, userData) {
        const vm = this;
        vm.currentPage = {
            title: 'Profile'
        };
        vm.formData = {};

        vm.onSubmit = function() {
            vm.formError = '';
            vm.formSuccess = '';

            if(!vm.formData.name && !vm.formData.description && !vm.formData.email) {
                //if user does not provide new name and new email, just do nothing
                vm.formError = 'You have not changed anything yet!';
            } else {
                userData.updateUserInfo(vm.formData)
                    .then((res) => {
                        authentication.saveToken(res.data.token);
                        vm.formSuccess = 'profile successfully changed';
                    })
                    .then(null, (res) => {
                        vm.formError = res.data.message;
                    });
            }
            return false;
        }
    }
})();
