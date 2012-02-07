/// <reference path="./lib/jquery-1.7.1.js" />
/// <reference path="./lib/require-jquery.js" />
/// <reference path="./lib/qunit-git.js" />
/// <reference path="./lib/knockout-2.0.0.js" />
/// <reference path="./modules/shell.js" />

QUnit.config.autostart = false;
jQuery.support.cors = true;
require
(
    [
    "modules/mvvm.tests",
    "modules/environment-manager.tests",
    "modules/shell.tests",
    ],
function () {
    QUnit.start();
});