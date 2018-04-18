(function() {
    angular
        .module('instagramApp')
        .directive('settingPanel', settingPanel);

    function settingPanel() {
        return {
            restrict: 'EA',
            scope: {
                select: '=select'
            },
            templateUrl: '/app_client/common/directives/settingPanel.template.html'
        };
    }
})();
