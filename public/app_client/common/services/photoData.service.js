(function() {
    angular
        .module('instagramApp')
        .service('photoData', photoData);

    photoData.$inject = ['$http', 'authentication', 'Upload'];
    function photoData($http, authentication, Upload) {
        /* I will use ng-file-upload, so we dont need this
        const addPhoto = function() {
            return $http.post(``, something);
        };
        */

        const deletePhoto = function(photoid) {
            return $http.delete(`/api/photo/${photoid}`, {
                headers: {
                    Authorization: authentication.getToken()
                }
            });
        };

        /*
        const getPhoto = function(photoid) {
            return $http.get(`/api/photo/${photoid}`);
        };
        */

        const getPhotoUrlsByUserId = function(owner) {
            return $http.get(`/api/photo?ownerid=${owner}`, {
                headers: {
                    Authorization: authentication.getToken()
                }
            });
        };

        const getPhotoUrlsByTime = function() {
            return $http.get(`/api/randomPhotos`);
        }

        /*
        const updatePhoto = function() {
        };
        */

        return {
            deletePhoto: deletePhoto,
//            getPhoto: getPhoto,
            getPhotoUrlsByUserId: getPhotoUrlsByUserId,
            getPhotoUrlsByTime: getPhotoUrlsByTime
        };
    }
})();
