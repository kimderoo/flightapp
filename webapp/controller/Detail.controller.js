sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("hogent.com.flightoverview.controller.Detail", {
            onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            },

            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
				var oArguments = oEvent.getParameter("arguments");
                var oView = this.getView();
                var odataModel = oView.getModel();

                oArguments.Fldate = new Date(oArguments.Fldate).toJSON();
                var urlPath = "/flightSet(Carrid='" + oArguments.Carrid + "',Connid='" + oArguments.Connid + "',Fldate=datetime'" + encodeURI(oArguments.Fldate.substr(0, 19)) + "')";

                oView.bindElement(urlPath);

                this.readElement(urlPath).done(function (oData) {
                    odataModel.refresh(true);
                }.bind(this));
            },

             readElement: function (path, filter) {
                var oDeferred = jQuery.Deferred();
                var odataModel = this.getView().getModel();
    
                odataModel.read(path, {
                    filters: [filter],
                    success: function (oData) {
                        return oDeferred.resolve(oData);
                    }.bind(this),
                    error: function (oError) {
                        return oDeferred.reject(oError);
                    }.bind(this)
                });
                return oDeferred.promise();
            },

        });
    });