(function() {
    angular
        .module('instagramApp')
        .directive('footerGeneric', footerGeneric);

    function footerGeneric() {
        return {
            restrict: 'EA',
            templateUrl: '/app_client/common/directives/footerGeneric.template.html'
        };
    }
})();
