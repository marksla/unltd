/// <reference path="./lib/jquery-1.7.1.js" />
/// <reference path="./lib/require-jquery.js" />
/// <reference path="./lib/qunit-git.js" />
/// <reference path="./lib/knockout-2.0.0.js" />
/// <reference path="./modules/shell.js" />
define(["./shell.viewModel", "./mvvm.model", "./create-service.tests"], function (shell, mvvm) {
    module('shell');

    function mockDiv() {

        var div = $("#mockDiv")[0];
        //div.id = "targetRegionId" + Math.random();
        return div;
    }

    function mockRegion(id) {
        return new mvvm.region(id);
    }

    function mockView() {

        var view = new mvvm.view(

        {
            aViewModelProperty: 'A view model property value'
        },
        '<div data-bind="text:aViewModelProperty"></div>'
        );
        view.render = function () {
            $("#" + view.region.id).html(view.html);
            ko.applyBindings(view.viewModel, $("#" + view.region.id)[0]);
        };
        return view;
    }

    test('Can I register a region?', function () {
        var div = new mockDiv();
        var region = shell.registerRegion(new mockRegion("mockDiv"));
        ok(region != null, "Region is not null");
        ok(region.id, "Region id is mapped to dom element id");

    });

    test('Can I register a view?', function () {

        var div = new mockDiv();
        var region = shell.registerRegion(new mockRegion("mockDiv"));
        var view = mockView();
        var registeredView = region.registerView(view);

        ok(region.views.length > 0, "Region contains a view.");
        ok(region.views[0] != null, "View is not null");

        equals(region.views[0].html, view.html, "Html is correct");
        equals(region.views[0].viewModel, view.viewModel, "view Model is correct");
    });


    test('Can I display a view?', function () {
        var div = new mockDiv();
        var region = shell.registerRegion(new mockRegion("mockDiv"));
        var view = mockView();
        var registeredView = region.registerView(view);

        registeredView.display();

        ok(div.children.length > 0, "Target region div contains view");
    });

    test('Does view data binding work?', function () {
        var div = new mockDiv();
        var region = shell.registerRegion(new mockRegion("mockDiv"));
        var view = mockView();
        var registeredView = region.registerView(view);

        registeredView.display();
        
        equals(div.innerText, "A view model property value", "View has databound to the view model");
    });

    test('Unregister a view', function () {
        var div = new mockDiv();
        var region = shell.registerRegion(new mockRegion("mockDiv"));
        var view = mockView();
        var registeredView = region.registerView(view);

        registeredView.display();

        registeredView.unregister();

        equals(div.innerText, "A view model property value", "View has databound to the view model");
    });

    test('See if registering loads of view instances causes a memory leak')

});