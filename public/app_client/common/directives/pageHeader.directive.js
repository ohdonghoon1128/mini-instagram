(function() {
    angular
        .module('instagramApp')
        .directive('pageHeader', pageHeader);

    function pageHeader() {
        return {
            restrict: 'EA',
            templateUrl: '/app_client/common/directives/pageHeader.template.html',
            controller: 'pageHeaderCtrl as phvm'
        };
    }
})();
