(function() {
    angular
        .module('instagramApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$routeParams', '$http', 'authentication', 'Upload', '$scope', 'photoData'];
    function homeCtrl($routeParams, $http, authentication, Upload, $scope, photoData) {
        const COLUMN = 3;
        const vm = this;

        vm.pageHeader = {
            title: 'mini-instagram'
            //change this later
        };
        vm.data = {};

        const userid = $routeParams.userid
        if(userid) {
            //userPageHeader();
            //userPageBody();
            userPage(userid);
        } else {
            //homePageHeader();
            //homePageBody();
            homePage();
        }

        function homePage() {
            /* test data
            vm.data = {
                urls: [
                    ['https://localhost:3001/test/pic-1.jpg',
                    'https://localhost:3001/test/pic-2.jpg',
                    'https://localhost:3001/test/pic-3.jpg'],
                    ['https://localhost:3001/test/pic-4.jpg',
                    'https://localhost:3001/test/pic-5.jpg',
                    'https://localhost:3001/test/pic-6.jpg'],
                    ['https://localhost:3001/test/pic-7.jpg',
                    'https://localhost:3001/test/pic-8.jpg',
                    'https://localhost:3001/test/pic-9.jpg'],
                    ['https://localhost:3001/test/pic-10.jpg',
                    'https://localhost:3001/test/pic-11.jpg',
                    'https://localhost:3001/test/pic-12.jpg'],
                    ['https://localhost:3001/test/pic-13.jpg',
                    'https://localhost:3001/test/pic-14.jpg']
                ]
            }*/

            photoData.getPhotoUrlsByTime()
                .then((res) => {
console.log(res.data);
                    vm.data.urls = to2dArray(res.data, COLUMN);
                })
                .then(null, (res) => {
                    console.log(res);
                    console.log(res.data.message);
                });
        }

        function userPage(userid) {
            photoData.getPhotoUrlsByUserId(userid)
                .then((res) => {
                    vm.data.urls = to2dArray(res.data, COLUMN);
                })
                .then(null, (res) => {
                    console.log(res);
                    console.log(res.data.message);
                });
        }

        function to2dArray(arr, col_size) {
            //convert 1d-array to 2D-array
            const urls = [];
            let row = -1;
            for(let i = 0; i < arr.length; i++) {
                col = i % col_size;
                if(col === 0) {
                    urls[++row] = [];
                }
                urls[row][col] = arr[i];
            }
            return urls;
        }

/*
        $scope.submit = function() {
            if($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        };*/

//        console.log($scope);

        $scope.submit = function() {
            const file = $scope.file;
            console.log(file);
            Upload
                .upload({
                    url: '/api/photo/',
                    data: {photo: file, username: 'hey'},
                    headers: {
                        Authorization: authentication.getToken()
                    }
                })
                .then((res) => {
                    console.log(res.data.message);
                })
                .then(null, (res) => {
                    console.log(res.data.message);
                });
        }
    }
})();
