
define([
    "../environment/environment.model",
    "../../lib/knockout",
    "../../lib/amplify-1.1.0/amplify"
],
 function (model) {
     var entitiesVm = function () {
         var self = this;
         self.environment = ko.observable();
         self.targetEnvironment = ko.observable();
         self.environments = ko.observable([]);
         self.status = ko.observable('Please select an environment');
         self.entities = ko.observableArray([]);
         self.selectedEntity = ko.observable();
         self.selectedEntityXml = ko.observable();
         self.response = ko.observable();
         self.canRefresh = ko.computed(function () { return self._environment != null; });
         self.transfer = function () {
             if (!self.environment() || !self.targetEnvironment()) {
                 self.status('Please select an environment.');
                 return;
             };
             self.status('Creating entity...');
             model.createEntity(self.environment(), self.selectedEntityXml(), false,
                function (response) {
                    self.response(ko.toJSON(response));
                });
         };
         self.refresh = function () {
             if (!self.environment()) {
                 self.status('Please select an environment.');
                 return;
             }
             model.getEntities(self.environment(),
                function (entities) {
                    self.entities(entities);
                },
                function (status) {
                    self.status('Error occured getting entities. ' + status);
                });
         };

         self.environment.subscribe(function (data) {
             self.refresh();
         });

         self.selectEntity = function (data) {
             var entity = ko.dataFor(data.node);

             self.selectedEntity(entity);
             model.getEntityXml(self.environment(), self.selectedEntity().Guid,
                 function (xml) {
                     self.selectedEntityXml(xml.GetEntityXmlResult);
                 });
             //amplify.publish("environment-select", envVM.environment);
         };

         amplify.subscribe("environments-refresh", function (environments) {
             self.environments(environments);
         });

         amplify.subscribe("environment-select", function (environment) {
             self.environment(environment);
             self.refresh();
         });

     };

     return new entitiesVm();
 });
