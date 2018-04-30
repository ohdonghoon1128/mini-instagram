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

        const deletePhotoById = function(photoid) {
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
        };

        const getCommentsById = function(photoid) {
            return $http.get(`/api/photo/${photoid}/comment`, {
                headers: {
                    Authorization: authentication.getToken()
                }
            });
        };

        const addCommentById = function(photoid, comment) {
            return $http.post(`/api/photo/${photoid}/comment`, {comment: comment}, {
                headers: {
                    Authorization: authentication.getToken()
                }
            });
        };

        return {
            deletePhotoById: deletePhotoById,
            getPhotoUrlsByUserId: getPhotoUrlsByUserId,
            getPhotoUrlsByTime: getPhotoUrlsByTime,
            getCommentsById: getCommentsById,
            addCommentById: addCommentById
        };
    }
})();
