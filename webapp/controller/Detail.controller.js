sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/Token',
    "sap/ui/model/json/JSONModel",
	'sap/ui/core/Fragment'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Token, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("hogent.com.flightoverview.controller.Detail", {
            onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);

                //create column model;
                this.oColumns = new JSONModel({
                    "cols": [
                        {
                            "label": "Game ID",
                            "template": "Id"
                        },
                        {
                            "label": "Game Name",
                            "template": "Name"
                        },
                        {
                            "label": "Genre",
                            "template": "Genre"
                        },
                        {
                            "label": "Developer",
                            "template": "Developer"
                        },
                        {
                            "label": "Platform",
                            "template": "Platform"
                        }
                    ]
                });

                //create games model
                this.oGameCollection = new JSONModel({});

            },

            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                var oArguments = oEvent.getParameter("arguments");
                var oView = this.getView();
                var odataModel = oView.getModel();

                oArguments.Fldate = new Date(oArguments.Fldate).toJSON();
                var urlPath = "/flightSet(Carrid='" + oArguments.Carrid + "',Connid='" + oArguments.Connid + "',Fldate=datetime'" + encodeURI(oArguments.Fldate.substr(0, 19)) + "')";

                oView.bindElement(urlPath);

                this.readElement(urlPath, odataModel).done(function (oData) {
                    odataModel.refresh(true);
                    this._setDefaultTokens(oData);
                    this._getGames();
                }.bind(this));
            },

            readElement: function (path, odatamodel, filter) {
                var oDeferred = jQuery.Deferred();

                odatamodel.read(path, {
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

            _getGames: function () {
                var oGame = this.getView().getModel("game");
                var urlPath = "/ZC_TCHR_GAMES_SH";
                
                this.readElement(urlPath, oGame).done(function (oData) {
                   //populate the local games model;
                   this.oGameCollection.setData(oData.results);
                }.bind(this));                
            },

            //value help code
            onValueHelpRequested: function () {
                var aCols = this.oColumns.getData().cols;

                Fragment.load({
                    name: "hogent.com.flightoverview.fragments.ValueHelpDialogGame",
                    controller: this
                }).then(function name(oFragment) {
                    this._oValueHelpDialog = sap.ui.xmlfragment("hogent.com.flightoverview.fragments.ValueHelpDialogGame", this);
                    this.getView().addDependent(this._oValueHelpDialog);
    
                    this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                        oTable.setModel(this.oGameCollection);
                        oTable.setModel(this.oColumns, "columns");
    
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/");
                        }
    
                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        this._oValueHelpDialog.update();
                    }.bind(this));
    
                    this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
                    this._oValueHelpDialog.open();
                }.bind(this));
            },

            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this._oMultiInput.setTokens(aTokens);
                this._oValueHelpDialog.close();
            },
    
            onValueHelpCancelPress: function () {
                this._oValueHelpDialog.close();
            },
    
            onValueHelpAfterClose: function () {
                this._oValueHelpDialog.destroy();
            },


            _setDefaultTokens: function (data) {
                this._oMultiInput = this.getView().byId("multiInput");
                this._oMultiInput.setTokens(this._getDefaultTokens(data));
            },

            _getDefaultTokens: function (tokenData) {
                var oToken = new Token({
                    key: "PC",
                    text: "Pac Man"
                });

                var oToken2 = new Token({
                    key: "SM",
                    text: "Super Mario"
                });

                return [oToken, oToken2];
            }

        });
    });