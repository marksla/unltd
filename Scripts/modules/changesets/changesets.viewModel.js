
define([
    "../../lib/knockout",
    "../../lib/amplify-1.1.0/amplify"
],
 function () {
     var vm = function () {
         var self = this;
         self.environment = ko.observable();
         self.status = ko.observable('Please select an environment');
         self.changesets = ko.observableArray([]);
         self.canRefresh = ko.computed(function () { return self.environment() != null; });
         self.refresh = function () {
             if (!self.environment()) {
                 self.status('Please select an environment.');
                 return;
             }
             self.environment().getAllChangeSetGroups(
                function (changesets) {
                    self.changesets(changesets);
                },
                function (status) {
                    self.status('Error occured getting entities. ' + status);
                });
         };

        amplify.subscribe("environments-refresh", function (environments) {
            self.environments(environments);
        });
         
         amplify.subscribe("environment-select", function (environment) {
             self.environment(environment);
             self.refresh();
         });
     };

     return new vm();
 });
