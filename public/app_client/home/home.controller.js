(function() {
    angular
        .module('instagramApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$routeParams', 'authentication', 'photoData', '$uibModal', '$route'];
    function homeCtrl($routeParams, authentication, photoData, $uibModal, $route) {
        const vm = this;
        const COLUMN = 3;

        vm.data = {};
        vm.pageNum = 0;

        const userid = $routeParams.userid;
        if(userid) {
            //download data from userid
            userPage(userid, vm.pageNum);

            vm.prevPage = function() {
                if(vm.pageNum <= 0) {
                    return;
                }
                vm.pageNum--;
                userPage(userid, vm.pageNum);
            }
            vm.nextPage = function() {
                if(vm.data.isLastPage) {
                    return;
                }
                vm.pageNum++;
                userPage(userid, vm.pageNum);
            }
        } else {
            //download most recent post
            homePage(vm.pageNum);

            vm.prevPage = function() {
                if(vm.pageNum <= 0) {
                    return;
                }
                vm.pageNum--;
                homePage(vm.pageNum);
            }
            vm.nextPage = function() {
                if(vm.data.isLastPage) {
                    return;
                }
                vm.pageNum++;
                homePage(vm.pageNum);
            }
        }

        function homePage(page) {
            photoData.getPhotoUrlsByTime(page)
                .then((res) => {
                    vm.data.photoInfos = to2dArray(res.data.photoInfos, COLUMN);
                    vm.data.isLastPage = res.data.isLastPage;
                    vm.popupPhotoDetail = popupPhotoDetail;
                })
                .then(null, (res) => {
                    console.log(res.data);
                });
        }

        function userPage(userid, page) {
            photoData.getPhotoUrlsByUserId(userid, page)
                .then((res) => {
                    vm.data.photoInfos = to2dArray(res.data.photoInfos, COLUMN);
                    vm.data.isLastPage = res.data.isLastPage;
                    vm.popupPhotoDetail = popupPhotoDetail;
                })
                .then(null, (res) => {
                    console.log(res.data);
                });
        }

        //convert 1d-array to 2D-array with given column size
        function to2dArray(arr, col_size) {
            const infos = [];
            let row = -1;
            for(let i = 0; i < arr.length; i++) {
                col = i % col_size;
                if(col === 0) {
                    infos[++row] = [];
                }
                infos[row][col] = arr[i];
            }
            return infos;
        }

        function popupPhotoDetail(info) {
            const uibModalInstance = $uibModal.open({
                templateUrl: '/app_client/photoDetailModal/photoDetailModal.view.html',
                controller: 'photoDetailModalCtrl as vm',
                size: 'lg',
                resolve: {
                    photoInfo: function() {
                        return info;
                    }
                }
            });

            uibModalInstance.result.then((data) => {
                $route.reload();
            });
        }
    }
})();
