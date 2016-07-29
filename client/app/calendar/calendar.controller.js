(function() {
    'use strict';

    angular
        .module('travelcal.calendar')
        .controller('CalendarController', CalendarController);

    CalendarController.$inject = [
        '$scope',
    ];

    function CalendarController($scope) {
        var vm = this;

        vm.eventSources = [];
        vm.uiConfig = {
            calendar: {
                height:450,
                editable: true,
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev, next'
                },
                eventClick: vm.alertEventOnClick,
                eventDrop: vm.alertOnDrop,
                eventResize: vm.alertOnResize
            }
        };


    }


})();


