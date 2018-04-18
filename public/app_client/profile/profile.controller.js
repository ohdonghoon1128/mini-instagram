(function() {
    angular
        .module('instagramApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['authentication'];
    function profileCtrl(authentication) {
        const vm = this;
        vm.pageHeader = {
            title: 'Profile'
        };
        vm.formData = {};

        vm.onSubmit = function() {
            vm.formError = '';
            vm.formSuccess = '';

            if(!vm.formData.name && !vm.formData.email) {
                //if user does not provide new name and new email, just do nothing
            } else {
            /*
                authentication.changeProfile(vm.formData)
                    .then((res) => {
                        vm.formSuccess = 'profile successfully changed';
                    })
                    .then(null, (res) => {
                        vm.formError = res.data.message;
                    });
                    */
            }
            return false;
        }
    }
})();
