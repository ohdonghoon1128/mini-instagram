(function() {
    angular
        .module('instagramApp')
        .service('photoData', photoData);

    photoData.$inject = ['$http', 'authentication', 'Upload'];
    function photoData($http, authentication, Upload) {
        const deletePhotoById = function(photoid) {
            return $http.delete(`/api/photo/${photoid}`, {
                headers: {
                    Authorization: authentication.getToken()
                }
            });
        };

        const getPhotoUrlsByUserId = function(owner, page) {
            return $http.get(`/api/photo?ownerid=${owner}&page=${page}`, {
                headers: {
                    Authorization: authentication.getToken()
                }
            });
        };

        const getPhotoUrlsByTime = function(page) {
            return $http.get(`/api/randomPhotos?page=${page}`);
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
