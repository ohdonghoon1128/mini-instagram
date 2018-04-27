(function() {
    angular
        .module('instagramApp')
        .service('userData', userData);

    userData.$inject = ['$http', 'authentication'];
    function userData($http, authentication) {
        const getUserInfoById = function(userid) {
            return $http.get(`/api/account/user/${userid}`);
        };

        const updateUserInfo = function(user) {
            return $http.put(`/api/account/profile`, user, {
                headers: {
                    Authorization: authentication.getToken()
                }
            });
        };

        return {
            getUserInfoById: getUserInfoById,
            updateUserInfo: updateUserInfo
        };
    }
})();
