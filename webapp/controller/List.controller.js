sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
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

            onSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Carrid", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }
    
                // update list binding
                var oTable = this.byId("table");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters, "Application");
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