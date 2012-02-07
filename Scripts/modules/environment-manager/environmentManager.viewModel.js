define([
    "../environment/environment.model",
    "../../lib/knockout",
    "../../lib/knockout.mapping",
    "../../lib/amplify-1.1.0/amplify"
],
 function (model) {
     var EnvironmentVM = function (environment, isNew) {
         ko.mapping.fromJS(environment, {}, this);
         var self = this;
         self.status = ko.observable('Disconnected');
         self.showLogInPane = ko.computed(function () {
             return self.specifyUser() == false;
         });
         self.isValid = ko.computed(function () {
             return self.name().length > 0;
         });
         self.isConnected = ko.computed(function () {
             return self.status() == "Connected";
         });
         self.toggleEditMode = function () {
             self.inEditMode(!self.inEditMode());
         };
         self.disconnect = function () {
             self.status('Disconnected');
         };
         self.hasError = ko.observable(false);
         self.error = ko.observable('');
         self.dirtyFlag = new ko.dirtyFlag(this, isNew);
         return self;
     };

     var viewModel = {
         environments: ko.observableArray([]),
         selectedEnvironment: ko.observable(),
         connectToEnvironment: function (environment) {
             model.connect(ko.mapping.toJS(environment),
            function () {
                environment.hasError(false);
                environment.status("Connected");
            },
            function (status) {
                environment.hasError(true);
                environment.status("Disconnected");
                environment.error(status);
            }
            );
         },
         addEnvironment: function () {
             var env = new model.Environment("Default", "https://localhost/", "", "", "TRIBOLD");
             viewModel.environments.push(new EnvironmentVM(env, true));
         },
         deleteEnvironment: function (environment) {
             viewModel.environments.remove(environment);
             viewModel.persist();
         },
         selectEnvironment: function (environment) {
             var envVm = ko.dataFor(environment.item);
             viewModel.selectedEnvironment(envVm);
         }
     };
     
     viewModel.persist = function () {
         model.storeEnvironments(ko.mapping.toJS(viewModel.environments));
         viewModel.clean();
     };
     viewModel.dirtyItems = ko.computed(function () {
         return ko.utils.arrayFilter(viewModel.environments(), function (item) {
             return item.dirtyFlag.isDirty();
         });
     }, this);
     viewModel.clean = function () {
         ko.utils.arrayFilter(viewModel.environments(), function (item) {
             item.dirtyFlag.reset();
         });
     };

     viewModel.isDirty = ko.computed(function () {
         return viewModel.dirtyItems().length > 0;
     }, this);

     viewModel.environments.subscribe(function (data) {
         amplify.publish("environments-refresh", ko.toJS(data));
     });

     viewModel.environments(ko.utils.arrayMap(model.getEnvironments(),
         function(environment) {
             return new EnvironmentVM(environment);
         }));

     return viewModel;
 });
