sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device", "sap/ui/core/Fragment", "../model/formatter",
	"sap/m/MessageToast", "sap/m/MessageBox"
], function (e, t, o, r, s, i, a, n, l, d, p) {
	"use strict";
	var u;
	return e.extend("Furnishing.controller.Master", {
		formatter: l,
		onInit: function () {
			var e = this.getOwnerComponent().getModel("RouteModel");
			e.setProperty("/split", true);
			e.setProperty("/normal", false);
			var t = this.byId("list"),
				o = this._createViewModel(),
				r = t.getBusyIndicatorDelay();
			this._oList = t;
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
			this.setModel(o, "masterView");
			t.attachEventOnce("updateFinished", function () {
				o.setProperty("/delay", r)
			});
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this)
		},
		onUpdateFinished: function (e) {
			this.getView().byId("list").getBinding("items").refresh();
			this._updateListItemCount(e.getParameter("total"))
		},
		onSearch: function (e) {
			if (e.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return
			}
			var t = e.getParameter("query");
			if (t) {
				this._oListFilterState.aSearch = [new o("Refnr", s.Contains, t)]
			} else {
				this._oListFilterState.aSearch = []
			}
			this._applyFilterSearch()
		},
		onNavToInitial: function () {
			var e = this.getOwnerComponent().getModel("buttonsModel");
			var t = e.getProperty("/process");
			var o = this;
			if (t === "Create") {
				p.information("Changes will be lost..Do you still want to navigate?", {
					title: "Alert",
					actions: [p.Action.YES, p.Action.CANCEL],
					onClose: function (e) {
						if (e === "YES") {
							o.getOwnerComponent().getModel("detailMasterModel").setData(null);
							o.getOwnerComponent().getRouter().navTo("initial");
							var t = o.getOwnerComponent().getModel("buttonsModel");
							t.setProperty("/mAdd", false);
							t.setProperty("/mReview", false);
							o.getModel("appView").setProperty("/layout", "OneColumn")
							
						}
						else{
							if (sap.ui.Device.system.desktop) {
							}
						else{
								t.setProperty("/mAdd", true);
							t.setProperty("/mAttach", true);
						}
					}
						}
					
				})
			} else if (t === "Edit") {
				p.information("New Changes (if any) will be lost..Do you still want to navigate?", {
					title: "Alert",
					actions: [p.Action.YES, p.Action.CANCEL],
					onClose: function (e) {
						if (e === "YES") {
							o.getOwnerComponent().getModel("detailMasterModel").setData(null);
							o.getOwnerComponent().getRouter().navTo("initial");
							var t = o.getOwnerComponent().getModel("buttonsModel");
							t.setProperty("/mAdd", false);
							t.setProperty("/mReview", false);
							o.getModel("appView").setProperty("/layout", "OneColumn")
						}
							if (e === "CANCEL") {
							if (sap.ui.Device.system.desktop) {
						}
						else{
								t.setProperty("/mAdd", true);
							t.setProperty("/mAttach", true);
						}
					}
					}
				})
			
			} else {
				this.getOwnerComponent().getModel("detailMasterModel").setData(null);
				this.getOwnerComponent().getRouter().navTo("initial");
				var e = this.getOwnerComponent().getModel("buttonsModel");
				e.setProperty("/mAdd", false);
				e.setProperty("/mReview", false)
			}
		},
		onRefresh: function () {
			this._oList.getBinding("items").refresh()
		},
		onRemarks: function (e) {
			var t = this.getOwnerComponent().getModel("buttonsModel");
			var o = t.getProperty("/headerRemarks");
			var r = !!this.getView().$().closest(".sapUiSizeCompact").length;
			p.information(o, {
				styleClass: r ? "sapUiSizeCompact" : ""
			})
		},
		onConfirmViewSettingsDialog: function (e) {
			this._applySortGroup(e)
		},
		_applySortGroup: function (e) {
			var t = e.getParameters(),
				o, s, i = [];
			o = t.sortItem.getKey();
			s = t.sortDescending;
			i.push(new r(o, s));
			this._oList.getBinding("items").sort(i)
		},
		onSelectionChange: function (e) {
			var t = this.getOwnerComponent().getModel("buttonsModel");
			var o = t.getProperty("/dSave");
			if (sap.ui.Device.system.desktop) {
				if (o === true) {
					p.information("You are in Edit Mode. Please Save the changes First");
					return
				}
			}
			var r = e.getSource(),
				s = e.getParameter("selected");
			if (!(r.getMode() === "MultiSelect" && !s)) {
				this._showDetail(e.getParameter("listItem") || e.getSource())
			}
		},
		onBypassed: function () {
			this._oList.removeSelections(true)
		},
		createGroupHeader: function (e) {
			return new i({
				title: e.text,
				upperCase: false
			})
		},
		onNavBack: function () {
			history.go(-1)
		},
		_createViewModel: function () {
			return new t({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Pernr",
				groupBy: "None"
			})
		},
		onBeforeRendering: function () {},
		_onMasterMatched: function (e) {
			var t = this.getOwnerComponent().getModel("RouteModel");
				var o1 = this.getOwnerComponent().getModel("buttonsModel");
			t.setProperty("/split", true);
			t.setProperty("/normal", false);
			u = e.getParameter("arguments").claimId;
			u = atob(u);
			if (u == "0") {
				
				if (sap.ui.Device.system.desktop) {
					var o = this.getView().byId("list").getItems()[0];
					this.getView().byId("list").setSelectedItem(o);
						o1.setProperty("/mReview", false);
						
							o1.setProperty("/rDelete",false);
					this._showDetail(o)
				}
			} else {
				
				sap.ui.core.BusyIndicator.show(0);
				var r = this.getOwnerComponent().getModel("InitialModel");
				var s = this;
				var oFilter = new sap.ui.model.Filter("REFNR", "EQ", u);
				r.read("/GetAllDataSet", {
					filters: [oFilter],
					success: function (e) {
						s.bindList(e)
					},
					error: function (e) {
						sap.ui.core.BusyIndicator.hide();
						d.show("Error Connecting odata service to backend")
					}
				})
			}
		},
		bindList: function (e) {
			var t = this.getOwnerComponent().getModel("detailMasterModel");
			var del=this.getOwnerComponent().getModel("deleteSet");
			t.setData(e.results);
				del.setData(e.results);
			
			sap.ui.core.BusyIndicator.hide();
			if (e.results[0].CSTAT == "N") {
				var o = this.getOwnerComponent().getModel("buttonsModel");
				
				o.setProperty("/mAdd", true);
				o.setProperty("/mAttach", true);
				o.setProperty("/claimType",e.results[0].RQTYP);
				o.setProperty("/mDelete", true);
				o.setProperty("/mRevoke", false);
				o.setProperty("/showEdit", true);
				o.setProperty("/rSaveDraft", true);
				
				o.setProperty("/rDelete",true);
				o.setProperty("/rSubmit", true);
				o.setProperty("/process", "Edit");
				o.setProperty("/prevPdf", false);
				o.setProperty("/claimId", u)
			} else if (e.results[0].CSTAT == "T") {
				var o = this.getOwnerComponent().getModel("buttonsModel");
				o.setProperty("/mAdd", false);
				
				o.setProperty("/mReview", true);
				o.setProperty("/prevPdf", false);
				o.setProperty("/mRevoke", true);
				o.setProperty("/mAttach", true);
				o.setProperty("/mDelete", false);
				o.setProperty("/showEdit", false);
				o.setProperty("/rSaveDraft", false);
				o.setProperty("/rDelete",true);
				o.setProperty("/rSubmit", false);
				o.setProperty("/process", "Display");
				o.setProperty("/claimId", u)
			} else {
				var o = this.getOwnerComponent().getModel("buttonsModel");
				o.setProperty("/mAdd", false);
				o.setProperty("/mReview", true);
				o.setProperty("/mRevoke", false);
				o.setProperty("/prevPdf", false);
				o.setProperty("/rDelete",false);
				o.setProperty("/mAttach", true);
				o.setProperty("/mDelete", false);
				o.setProperty("/showEdit", false);
				o.setProperty("/rSaveDraft", false);
				o.setProperty("/rSubmit", false);
				o.setProperty("/process", "Display");
				o.setProperty("/claimId", u);
				
			}
			 if (e.results[0].FlagAttach === "") {
			 	o.setProperty("/count", 1);
			 	o.setProperty("/prevPdf", false)
			 } else if (e.results[0].FlagAttach === "X") {
			 	o.setProperty("/count", 0);
			 	o.setProperty("/prevPdf", true)
			 }
			 if (e.results[0].FlagAttachApp === "") {
			 	o.setProperty("/prevAppPdf", false)
			 } else {
			 	o.setProperty("/prevAppPdf", true)
			 }
			// if (e.Remarks !== "") {
			// 	this.getView().byId("remarksButton").setVisible(true);
			// 	o.setProperty("/headerRemarks", e.Remarks)
			// } else {
			// 	this.getView().byId("remarksButton").setVisible(false)
			// }
			 o.setProperty("/filesize", e.Fsize);
			if (sap.ui.Device.system.desktop) {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				var r = this.getView().byId("list").getItems()[0];
				this.getView().byId("list").setSelectedItem(r);
				this._showDetail(r)
			} else {
				this.getModel("appView").setProperty("/layout", "OneColumn")
			}
		},
		_showDetail: function (e) {
			var t = !a.system.phone;
			var o = e.getBindingContextPath();
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				objectId: btoa(o)
			}, t)
		},
		onAddM: function () {
			var e = this.getOwnerComponent().getModel("buttonsModel");
			var t = !a.system.phone;
			if (sap.ui.Device.system.desktop) {
				e.setProperty("/mAdd", false)
			} else {
				e.setProperty("/mAdd", true)
			}
			
			var o = "1";
			this.getRouter().navTo("object", {
				objectId: btoa(o)
			}, t)
		},
		onDeleteM: function () {
			var e = this.getView().byId("list").getSelectedContextPaths();
			e = e.toString();
			e = e.slice(1);
			var t = this.getOwnerComponent().getModel("detailMasterModel").oData;
			var o = t.length;
			if (o == e || !e) {
				p.information("Please select a record to delete!", {
					title: "Alert"
				});
				return
			}
			t.splice(e, 1);
			this.getOwnerComponent().getModel("detailMasterModel").setData(t);
			if (t.length === 0) {
				var r = this.getOwnerComponent().getModel("buttonsModel");
				r.setProperty("/mDelete", false);
				r.setProperty("/mAttach", false);
				this.onAddM()
			}
		},
		_updateListItemCount: function (e) {
			var t;
			if (this._oList.getBinding("items").isLengthFinal()) {
				t = this.getResourceBundle().getText("masterTitleCount", [e]);
				this.getModel("masterView").setProperty("/title", t)
			}
		},
		_applyFilterSearch: function () {
			var e = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				t = this.getModel("masterView");
			this._oList.getBinding("items").filter(e, "Application");
			if (e.length !== 0) {
				t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"))
			} else if (this._oListFilterState.aSearch.length > 0) {
				t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"))
			}
		},
		_updateFilterBar: function (e) {
			var t = this.getModel("masterView");
			t.setProperty("/isFilterBarVisible", this._oListFilterState.aFilter.length > 0);
			t.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [e]))
		},
		onReview: function () {
			this.getOwnerComponent().getRouter().navTo("review")
		},
		onAttachment: function () {
			this.getOwnerComponent().getRouter().navTo("attachment")
		},
		onRevoke: function () {
			sap.ui.core.BusyIndicator.show(0);
			var e = this.getOwnerComponent().getModel("InitialModel");
			var t = this;
			e.read("/Recall_ClaimSet('" + u + "')", {
				success: function (e) {
					sap.ui.core.BusyIndicator.hide();
					if (e.Type === "S") {
						p.success("Claim No. " + u + " has been Recalled Successfully.", {
							icon: p.Icon.SUCCESS,
							title: "Success",
							action: [p.Action.OK],
							onClose: function (e) {
								t.getOwnerComponent().getRouter().navTo("initial")
							}
						})
					} else {
						p.error("Claim No. " + u + " cannot be Recall.", {
							icon: p.Icon.ERROR,
							title: "Alert",
							action: [p.Action.OK],
							onClose: function (e) {
								t.getOwnerComponent().getRouter().navTo("initial")
							}
						})
					}
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide();
					d.show("Error Connecting odata service to backend")
				}
			})
		},
		onSaveDraft: function () {
			sap.ui.core.BusyIndicator.show(0);
			var l = [];
			var y = {
				Type: "E"
			};
			l.push(y);
			var e = this.getOwnerComponent().getModel("detailMasterModel").getData();
			// var t = this.getOwnerComponent().getModel("FileReaderModel");
			var r = this.getOwnerComponent().getModel("buttonsModel");

			var P = r.getProperty("/process");
			var m = r.getProperty("/claimId");
			var reqType= r.getProperty("/claimType");
			var r1 = this.getOwnerComponent().getModel("detailMasterModel");
			var a = r1.getData().length;
			var n = 0;
			for (var i = 0; i < a; i++) {
				var s = r1.getObject("/" + i).RQAMT;
				s = parseFloat(s);
				n = n + s;
			}
			if (P === "Edit") {
				var data = r1.getData();
				var len = data.length;
				var dataNew = [];
				if(reqType==="AD")
				for (var i = 0; i < len; i++) {

					var item = {};
					item["RQAMT"] = data[i].RQAMT;
					item["LINUM"] = data[i].LINUM;
					item["RQTYP"] = data[i].RQTYP;
					item["REFNR"] = data[i].REFNR;
					item["CSTAT"] = data[i].CSTAT;
					item["C20T5"] = data[i].C20T5;
					dataNew.push(item);

				}
					if(reqType==="CA")
				for (var i = 0; i < len; i++) {

					var item = {};
					item["LINUM"] = data[i].LINUM;
					item["RQTYP"] = data[i].RQTYP;
					item["REFNR"] = data[i].REFNR;
					item["CSTAT"] = data[i].CSTAT;
					item["RQAMT"] = data[i].RQAMT;
					item["ASREF"] = data[i].ASREF;
					item["APAMT"] = data[i].APAMT;
					item["CDT01"] = data[i].CDT01;
					item["C10T5"] = data[i].C10T5;
					item["C20T1"] = data[i].C20T1;
					item["C20T2"] = data[i].C20T2;
					item["C40T1"] = data[i].C40T1;
					item["C40T2"] = data[i].C40T2;
					item["C40T5"] = data[i].C40T5;
					item["C40T3"] = data[i].C40T3_V;
					item["AMT01"] = data[i].AMT01;
					item["AMT02"] = data[i].AMT02;
					item["AMT03"] = data[i].AMT03;
					item["AMT04"] = data[i].AMT04;
					item["AMT05"] = data[i].AMT05;
					item["AMT06"] = data[i].AMT06;
					item["AMT07"] = data[i].AMT07;
					dataNew.push(item);

				}
					if(reqType==="CL")
				for (var i = 0; i < len; i++) {

					var item = {};
						item["LINUM"] = data[i].LINUM;
					item["RQTYP"] = data[i].RQTYP;
					item["REFNR"] = data[i].REFNR;
					item["CSTAT"] = data[i].CSTAT;
					item["RQAMT"] = data[i].RQAMT;
					item["ASREF"] = data[i].ASREF;
					item["APAMT"] = data[i].APAMT;
					item["CDT01"] = data[i].CDT01;
					item["C10T5"] = data[i].C10T5;
					item["C20T1"] = data[i].C20T1;
					
				item["C20T5"] = data[i].C20T5;
				item["C40T1"] = data[i].C40T1;
					item["C40T2"] = data[i].C40T2;
					item["C40T5"] = data[i].C40T5;
						item["C40T4"] = data[i].C40T4;
					item["C40T3"] = data[i].C40T3;
					item["AMT01"] = data[i].AMT01;
					item["AMT02"] = data[i].AMT02;
					item["AMT03"] = data[i].AMT03;
					item["AMT04"] = data[i].AMT04;
					item["AMT05"] = data[i].AMT05;
					item["AMT06"] = data[i].AMT06;
					item["AMT07"] = data[i].AMT07;
					

					dataNew.push(item);

				}
			}
			// var M = r.getProperty("/prevPdf");
			// var b = r.getProperty("/prevAppPdf");
			// if (M == false) {
			// 	var w = "X"
			// } else {
			// 	w = ""
			// }
			// if (b == false) {
			// 	var F = "X"
			// } else {
			// 	F = ""
			// }
			if (P === "Create") {
			var m1 = "";
			var asref=this.getOwnerComponent().getModel("buttonsModel").getProperty("/asref");
			if(reqType==="AD" || reqType==="CL")
			{
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "X",
			//	CSTAT:"",ASREF:"",
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: e,
				//TOAttach: o,
				TOMessage: l

			};
			}
			if(reqType==="CA")
			{
				var len=e.length;
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "X",
				ASREF:asref,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: e,
				//TOAttach: o,
				TOMessage: l

			};
			}
		}
			if (P === "Edit") {
				var asref=this.getOwnerComponent().getModel("buttonsModel").getProperty("/asref");
			if(reqType==="AD" || reqType==="CL")
			{
			var C = {

				REFNR: m,
				RQAMT: n.toString(),
				FLAGSD: "X",
			//	CSTAT:"",ASREF:"",
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: dataNew,
				//TOAttach: o,
				TOMessage: l

			};
			}
			if(reqType==="CA")
			{
			var C = {

				REFNR: m,
				RQAMT: n.toString(),
				FLAGSD: "X",
				ASREF:asref,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: dataNew,
				//TOAttach: o,
				TOMessage: l

			};
			}
			}
			this.finalCall(C);
		},
		finalCall: function (e) {
			var t = this.getOwnerComponent().getModel("InitialModel");
			var r = this;
			t.create("/CreateDocumentSet", e, {
				success: function (e) {
					sap.ui.core.BusyIndicator.hide();
					var t = e.TOMessage.results.length;
					var i = false;
					var s = "";
					for (var o = 0; o < t; o++) {
						s = e.TOMessage.results[o].Type;
						if ("E" === s) {
							i = true;
							e.TOMessage.results[o].Type = "Error"
						}
						if ("I" === s) e.TOMessage.results[o].Type = "Information";
						if ("W" === s) e.TOMessage.results[o].Type = "Warning";
						if ("S" === s) e.TOMessage.results[o].Type = "Success"
					}
					if (i) {
						r.getView().byId("errorBtn").setVisible(true);
						r.getView().byId("errorBtn").setText(e.TOMessage.results.length);
						var l = r.getOwnerComponent().getModel("ErrorMessages");
						l.setData(e.TOMessage.results);
						v.setModel(l);
						p.alert("Error Occured while submitting claim!", {
							title: "Error!"
						})
					} else {
						var n = e.TOMessage.results[0].Message;
						p.success(n, {
							title: "Success!",
							actions: [p.Action.OK],
							onClose: function (e) {
								r.onNavBack()
							}
						})
					}
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide();
					if (!e.TOMessage) {
						p.error(e.message + " :" + e.statusCode)
					} else {
						var t = e.TOMessage.results[0].Message;
						p.error(t)
					}
				}
			})
		},

		onSubmit: function () {
		sap.ui.core.BusyIndicator.show(0);
			var l = [];
			var y = {
				Type: "E"
			};
			l.push(y);
			var e = this.getOwnerComponent().getModel("detailMasterModel").getData();
			// var t = this.getOwnerComponent().getModel("FileReaderModel");
			var r = this.getOwnerComponent().getModel("buttonsModel");

			var P = r.getProperty("/process");
			var m = r.getProperty("/claimId");
			var reqType= r.getProperty("/claimType");
			var r1 = this.getOwnerComponent().getModel("detailMasterModel");
			var a = r1.getData().length;
			var n = 0;
			for (var i = 0; i < a; i++) {
				var s = r1.getObject("/" + i).RQAMT;
				s = parseFloat(s);
				n = n + s;
			}
			if (P === "Edit") {
				var data = r1.getData();
				var len = data.length;
				var dataNew = [];
				if(reqType==="AD")
				for (var i = 0; i < len; i++) {

					var item = {};
					item["RQAMT"] = data[i].RQAMT;
					item["LINUM"] = data[i].LINUM;
					item["RQTYP"] = data[i].RQTYP;
					item["REFNR"] = data[i].REFNR;
					item["CSTAT"] = data[i].CSTAT;
					item["C20T5"] = data[i].C20T5;
					dataNew.push(item);

				}
					if(reqType==="CA")
				for (var i = 0; i < len; i++) {

					var item = {};
					item["LINUM"] = data[i].LINUM;
					item["RQTYP"] = data[i].RQTYP;
					item["REFNR"] = data[i].REFNR;
					item["CSTAT"] = data[i].CSTAT;
					item["RQAMT"] = data[i].RQAMT;
					item["ASREF"] = data[i].ASREF;
					item["APAMT"] = data[i].APAMT;
					item["CDT01"] = data[i].CDT01;
					item["C10T5"] = data[i].C10T5;
					item["C20T1"] = data[i].C20T1;
					item["C20T2"] = data[i].C20T2;
					item["C40T1"] = data[i].C40T1;
					item["C40T2"] = data[i].C40T2;
					item["C40T5"] = data[i].C40T5;
					item["C40T3"] = data[i].C40T3_V;
					item["AMT01"] = data[i].AMT01;
					item["AMT02"] = data[i].AMT02;
					item["AMT03"] = data[i].AMT03;
					item["AMT04"] = data[i].AMT04;
					item["AMT05"] = data[i].AMT05;
					item["AMT06"] = data[i].AMT06;
					item["AMT07"] = data[i].AMT07;
					dataNew.push(item);

				}
					if(reqType==="CL")
				for (var i = 0; i < len; i++) {

					var item = {};
						item["LINUM"] = data[i].LINUM;
					item["RQTYP"] = data[i].RQTYP;
					item["REFNR"] = data[i].REFNR;
					item["CSTAT"] = data[i].CSTAT;
					item["RQAMT"] = data[i].RQAMT;
					item["ASREF"] = data[i].ASREF;
					item["APAMT"] = data[i].APAMT;
					item["CDT01"] = data[i].CDT01;
					item["C10T5"] = data[i].C10T5;
					item["C20T1"] = data[i].C20T1;
					
				item["C20T5"] = data[i].C20T5;
				item["C40T1"] = data[i].C40T1;
					item["C40T2"] = data[i].C40T2;
					item["C40T5"] = data[i].C40T5;
						item["C40T4"] = data[i].C40T4;
					item["C40T3"] = data[i].C40T3;
					item["AMT01"] = data[i].AMT01;
					item["AMT02"] = data[i].AMT02;
					item["AMT03"] = data[i].AMT03;
					item["AMT04"] = data[i].AMT04;
					item["AMT05"] = data[i].AMT05;
					item["AMT06"] = data[i].AMT06;
					item["AMT07"] = data[i].AMT07;
					

					dataNew.push(item);

				}
			}
			// if (P === "Display") {
			// 	var data = r1.getData();
			// 	var len = data.length;
			// 	var dataNew = [];
			// 	for (var i = 0; i < len; i++) {

			// 		var item = {};
			// 		item["AMT01"] = data[i].AMT01;
			// 		item["APAMT"] = data[i].APAMT;
			// 		item["C04T1"] = data[i].C04T1;
			// 		item["C10T1"] = data[i].C10T1;
			// 		item["C10T2"] = data[i].C10T2;
			// 		item["C10T3"] = data[i].C10T3;
			// 		item["C20T1"] = data[i].C20T1;
			// 		item["C20T1_B"] = data[i].C20T1_B;
			// 		item["C40T1"] = data[i].C40T1;
			// 		item["CDT01"] = data[i].CDT01;
			// 		item["CDT02"] = data[i].CDT02;
			// 		item["CSTAT"] = data[i].CSTAT;
			// 		item["LINUM"] = data[i].LINUM;
			// 		item["REFNR"] = data[i].REFNR;
			// 		item["RQAMT"] = data[i].RQAMT;

			// 		dataNew.push(item);

			// 	}
			// }
			// var M = r.getProperty("/prevPdf");
			// var b = r.getProperty("/prevAppPdf");
			// if (M == false) {
			// 	var w = "X"
			// } else {
			// 	w = ""
			// }
			// if (b == false) {
			// 	var F = "X"
			// } else {
			// 	F = ""
			// }
			if (P === "Create") {
			var m1 = "";
			var asref=this.getOwnerComponent().getModel("buttonsModel").getProperty("/asref");
			if(reqType==="AD" || reqType==="CL")
			{
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "",
			//	CSTAT:"",ASREF:"",
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: e,
				//TOAttach: o,
				TOMessage: l

			};
			}
			if(reqType==="CA")
			{
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "",
				ASREF:asref,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: e,
				//TOAttach: o,
				TOMessage: l

			};
			}
		}
			if (P === "Edit") {
				var asref=this.getOwnerComponent().getModel("buttonsModel").getProperty("/asref");
			if(reqType==="AD" || reqType==="CL")
			{
			var C = {

				REFNR: m,
				RQAMT: n.toString(),
				FLAGSD: "",
			//	CSTAT:"",ASREF:"",
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: dataNew,
				//TOAttach: o,
				TOMessage: l

			};
			}
			if(reqType==="CA")
			{
			var C = {

				REFNR: m,
				RQAMT: n.toString(),
				FLAGSD: "",
				ASREF:asref,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: dataNew,
				//TOAttach: o,
				TOMessage: l

			};
			}
			}
			// } else if (P === "Create") {
			// 	var C = {

			// 		REFNR: "",
			// 		RQAMT: n.toString(),
			// 		FLAGSD:"X",
			// 		CSTAT:"N",
			// 		C20T1:e[a-1].C20T1,
			// 		C04T1:e[a-1].C04T1,
			// 		//Apamt: "0",
			// 	//	FlagSd: "X",
			// 		TOItem: e,
			// 		//TOAttach: o,
			// 		TOMessage: l
			// 	};
			// }
			this.finalCall(C);
		},
	})
});