(function() {
    angular
        .module('instagramApp')
        .directive('httpSrc', httpSrc);
    
    httpSrc.$inject = ['$http', 'authentication'];
    function httpSrc($http, authentication) {
        const directive = {
            /*scope: {
                url: '=httpSrc'
            },*/
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //scope.$watch("url", function () {
                
                var requestConfig = {
                    method: 'Get',
                    //url: scope.url,
                    url: attrs.httpSrc,
                    responseType: 'arraybuffer',
                    cache: 'true',
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                };

                console.log(requestConfig);

                $http(requestConfig)
                    .then(function(res) {
                        var arr = new Uint8Array(res.data);

                        var raw = '';
                        var i, j, subArray, chunk = 5000;
                        for (i = 0, j = arr.length; i < j; i += chunk) {
                            subArray = arr.subarray(i, i + chunk);
                            raw += String.fromCharCode.apply(null, subArray);
                        }

                        var b64 = btoa(raw);

                        attrs.$set('src', "data:image/jpeg;base64," + b64);
                    })
                    .then(null, (res) => {
                        console.log(res);
                    });
            //},true)
        }
    }
})();
