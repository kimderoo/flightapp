/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"hogentcom/flight_overview/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
