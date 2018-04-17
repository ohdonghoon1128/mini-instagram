(function() {
    angular
        .module('instagramApp')
        .service('authentication', authentication);

    authentication.$inject = ['$http', '$window'];
    function authentication($http, $window) {
        const getToken = function() {
            return $window.localStorage.userToken;
        };

        const saveToken = function(token) {
            if(!token) {
                throw new Error(`invalid token(${token})`);
            }

            $window.localStorage.userToken = token;
        };

        const register = function(user) {
            return $http.post(`/api/account/register`, user)
                        .then((res) => {
                            saveToken(res.data.token);
                            return res;
                        });
        };

        const login = function(user) {
            return $http.post(`/api/account/login`, user)
                        .then((res) => {
                            saveToken(res.data.token);
                            return res;
                        });
        };

        const logout = function() {
            $window.localStorage.removeItem('userToken');
        };

        const isLoggedIn = function() {
            const token = getToken();
            if(!token) {
                return false;
            }

            const payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now();
        };

        const currentUser = function() {
            const token = getToken();
            if(!token) {
                return;
            }

            const payload = JSON.parse($window.atob(token.split('.')[1]));

            return {
                userid: payload.userid,
                email: payload.email
            };
        };

        return {
            getToken: getToken,
            saveToken: saveToken,
            register: register,
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    }
})();
