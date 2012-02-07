define(
    [
        "modules/shell/shell.model",
        "lib/knockout",
        "lib/kendoui/source/js/kendo.all"
    ],
    function (shell) {
        ko.dirtyFlag = function (root, isInitiallyDirty) {
            var result = function() { };
            var _initialState = ko.observable(ko.toJSON(root));
            var _isInitiallyDirty = ko.observable(isInitiallyDirty);

            result.isDirty = ko.dependentObservable(function () {
                return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
            });

            result.reset = function () {
                _initialState(ko.toJSON(root));
                _isInitiallyDirty(false);
            };

            return result;
        };
        ko.bindingHandlers['kendoDropDownList'] = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var options = valueAccessor() || {};

            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = valueAccessor() || {};
                $(document).ready(function () { $(element).kendoDropDownList(options); });
            }
        };
        ko.bindingHandlers['kendoTabStrip'] = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var options = valueAccessor() || {};

            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = valueAccessor() || {};
                $(document).ready(function () { $(element).kendoTabStrip(options); });
            }
        };

        ko.bindingHandlers['kendoPanelBar'] = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var options = valueAccessor() || {};

            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = valueAccessor() || {};
                $(document).ready($(element).kendoPanelBar(options));
            }
        };

        ko.bindingHandlers['kendoTreeView'] = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var options = valueAccessor() || {};

            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = valueAccessor() || {};
                $(document).ready($(element).kendoTreeView(options));
            }
        };

        ko.bindingHandlers['region'] = {

            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = valueAccessor() || {};
                require([

                    "modules/text!modules/" + options.view + ".html", "modules/" + options.vm + ".viewModel"],
                    function (html, vm) {
                        $(element).html(html);
                        ko.applyBindingsToDescendants(vm, element);
                    });
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };

        ko.applyBindings();

    });