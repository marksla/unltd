
define([
    "../../lib/knockout",
    "../../lib/amplify-1.1.0/amplify"
],
 function () {
     var view = function () {
         var self = this;
         self.entries = ko.observableArray([]);
         
         amplify.subscribe("log", function (entry) {
             self.entries.push({ time: Date(), entry: entry });
         });
     };
     return new view();
 });
