(function() {
    angular
        .module('instagramApp')
        .directive('pageHeader', pageHeader);

    function pageHeader() {
        return {
            restrict: 'EA',
            scope: {
                content: '=content'
            },
            templateUrl: '/app_client/common/directives/pageHeader.template.html'
        };
    }
})();
