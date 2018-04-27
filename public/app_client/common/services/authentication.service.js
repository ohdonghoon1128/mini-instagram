(function() {
    angular
        .module('instagramApp')
        .service('authentication', authentication);

    authentication.$inject = ['$http', '$window'];
    function authentication($http, $window) {
        const getToken = function() {
            return $window.localStorage.userToken ? 'Bearer ' + $window.localStorage.userToken : '';
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

        const changeProfile = function(user) {
        /*
            return $http.put(`/api/account/profile`, user, {headers: {Authorization: 'Bearer ' + getToken()}})
                        .then((res) => {
                            saveToken(res.data.token);
                            return res;
                        });
                        */
        };

        const changePassword = function(user) {
            return $http.put(`/api/account/password`, user, {headers: {Authorization: getToken()}})
                        .then((res) => {
                            saveToken(res.data.token);
                            return res;
                        });
        };

        const deleteAccount = function(password) {
            return $http.post(`/api/account/delete`, {password: password}, {headers: {Authorization: getToken()}});
        }

        const logout = function() {
            $window.localStorage.removeItem('userToken');
        };

        const isLoggedIn = function() {
            const token = $window.localStorage.userToken;
            if(!token) {
                return false;
            }

            const payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now();
        };

        const currentUser = function() {
            const token = $window.localStorage.userToken;
            if(!token) {
                return {};
            }

            const payload = JSON.parse($window.atob(token.split('.')[1]));

            return {
                userid: payload.userid,
                email: payload.email
            };
        };

        const getAccessLevel = function(userid) {
            return $http.get(`/api/account/user/${userid}/access_level`);
        };
        const changeAccessLevel = function(isPrivate) {
            return $http.put(`/api/account/access_level`, {isPrivate: isPrivate}, {
                headers: {
                    Authorization: getToken()
                }
            });
        };

        return {
            getToken: getToken,
            saveToken: saveToken,
            register: register,
            login: login,
            changeProfile: changeProfile,
            changePassword: changePassword,
            deleteAccount: deleteAccount,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            getAccessLevel: getAccessLevel,
            changeAccessLevel: changeAccessLevel
        };
    }
})();
