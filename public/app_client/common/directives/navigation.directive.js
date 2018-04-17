(function() {
    angular
        .module('instagramApp')
        .directive('navigation', navigation);

    function navigation() {
        return {
            restrict: 'EA',
            templateUrl: '/app_client/common/directives/navigation.template.html',
            controller: 'navigationCtrl as navvm'
        };
    }
})();
