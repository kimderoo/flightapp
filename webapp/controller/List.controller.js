sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("hogent.com.flightoverview.controller.List", {
            onInit: function () {
                var date = new Date();
                var oNewModel = {
                    Carrid: "",
                    Connid: ""
                }
                var oLocal = new JSONModel(oNewModel);
                this.getView().setModel(oLocal, "local");
            },
            handleSavePress: function () {
                //get properties
                var oEntry = this.getView().getModel("local").getData();
                oEntry.Fldate = new Date(oEntry.Fldate);
                var oData = this.getView().getModel();

                oData.create("/flightSet", oEntry, {
                    success: function (data) {
                        alert("success");
                    },
                    error: function (e) {
                        alert("error");
                    }
                });

            },

            handleListItemPress: function (oEvent) {
                var sCarrid = oEvent.getSource().getBindingContext().getProperty("Carrid");
                var sConnid = oEvent.getSource().getBindingContext().getProperty("Connid");
                var sFldate = oEvent.getSource().getBindingContext().getProperty("Fldate").toString();


                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.navTo("Detail", {
                    Carrid: sCarrid,
                    Connid: sConnid,
                    Fldate: sFldate
                });                
            }
        });
    });