/// <reference path="../lib/jquery-1.7.1.js" />
/// <reference path="../lib/require-jquery.js" />
/// <reference path="../lib/qunit-git.js" />
/// <reference path="../lib/knockout.js" />
define(
[
    "./environment.model",
    "./environment-manager.viewModel",
],

function (model, vm) {
    module('environment-manager.model');
    var env = new model.environment("Test", "https://localhost/TriboldPPMWebServices/", "Mark.Slater", "M910mrx!", "TRIBOLD");
    asyncTest("Connect to environment and get response", function () {
        env.callService("HelloWorld", null,
            function (response) {
            ok(true, response);

            },
            function (error) {
            ok(false, error);

            }
        );
        setTimeout(function () {
            ok(true);
            start();
        }, 1000);
    });
    module('environment-manager.viewModel');

    test("Add an environment", function () {
        vm.addEnvironment();

        equals(vm.environments()[0].name(), "Default");

        vm.environments()[0].name = "Test Environment";
        vm.environments()[0].address = "https://localhost/TriboldPPMWebServices/";
        vm.environments()[0].userName = "Test User";
        vm.environments()[0].password = "Password1";
        vm.environments()[0].domain = "DOMAIN";
        
        ok(vm.environments().length > 0);
        vm.deleteEnvironment(vm.environments()[0]);
    });

    test("Edit an environment", function () {
        vm.addEnvironment();
        vm.environments()[0].name = "Test Environment";
        vm.environments()[0].address = "https://localhost/TriboldPPMWebServices/";
        vm.environments()[0].userName = "Test User";
        vm.environments()[0].password = "Password1";
        vm.environments()[0].domain = "DOMAIN";

        vm.environments()[0].password = "Password2";

        equals(vm.environments()[0].password, "Password2");
        vm.deleteEnvironment(vm.environments()[0]);
    });

    test("Delete an environment", function () {
        vm.addEnvironment();
        vm.environments()[0].name = "Test Environment";
        vm.environments()[0].address = "https://localhost/TriboldPPMWebServices/";
        vm.environments()[0].userName = "Test User";
        vm.environments()[0].password = "Password1";
        vm.environments()[0].domain = "DOMAIN";
        vm.deleteEnvironment(vm.environments()[0]);

        ok(vm.environments().length == 0);
    });

});