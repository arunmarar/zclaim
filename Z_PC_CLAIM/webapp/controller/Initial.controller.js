sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"../model/formatter"
], function (e, t, a, r, s, o) {
	"use strict";
	return e.extend("Furnishing.controller.Initial", {
		formatter: o,
		onInit: function () {
			var that = this;
			var t = {
				split: false,
				normal: true
			};
			var a = this.getOwnerComponent().getModel("RouteModel");
			a.setData(t);
			this.getView().byId("inpClaim").attachBrowserEvent("keydown", function (t) {
				if (t.keyCode == 13) {
					this.onSearch()
				}
			});
					this.statusSet = this.getOwnerComponent().getModel("statusSet");
					this.hod = this.getOwnerComponent().getModel("hod");
					var status = {
					"STATUSSet": [{
							"Value": "N",
							"Text": "New"
						}, {
							"Value": "T",
							"Text": "To be Approved"
						}, {
							"Value": "P",
							"Text": "Partially Approved"
						}, {
							"Value": "R",
							"Text": "Rejected"
						}, {
							"Value": "D",
							"Text": "Processing Complete"
						}, {
							"Value": "X",
							"Text": "Deleted"
						}, {
							"Value": "A",
							"Text": "Approved"
						}, {
							"Value": "B",
							"Text": "To Be Processed"
						}, {
							"Value": "C",
							"Text": "Closed"
						}, {
							"Value": "K",
							"Text": "Cancelled"
						}, {
							"Value": "S",
							"Text": "Settled"
						
					},
				]
			};
			this.statusSet.setData(status);
			this.getView().byId("selStatus").setModel(this.statusSet, "InitialModel");
			var l = this.getOwnerComponent().getModel("InitialModel");
			//l.read("/SelectHODSet", {
				//success: function (e) {
				//	that.hod.setData(e.results);
				//},
				//error: function (e) {
				//	t.show("Error Connecting odata service to backend")
				//}
			//})
			this.getOwnerComponent().getRouter().getRoute("initial").attachPatternMatched(this._onMasterMatched, this)
		},
		bindTable: function (e) {
			var t = new sap.ui.model.json.JSONModel;
			var a = new sap.ui.model.json.JSONModel;
			var r = e.results.length;
			t.setData(e.results);
			this.getView().setModel(t, "Initial")
		},
		_onMasterMatched: function () {
			var e = {
				split: false,
				normal: true
			};
			var a = this.getOwnerComponent().getModel("RouteModel");
			a.setData(e);
			this.getView().byId("inpClaim").setValue("");
		//	this.getView().byId("selStatus").setSelectedIndex(0);
			this.getView().byId("fbDP").setValue(null);
			this.getView().byId("fbDP2").setValue(null);
			var r = {
				dSave: false,
				dClear: false,
				dAdd: false,
				dSelect: false,
				mAdd: false,
				dClaimA: false,
				mDelete: false,
				mAttach: false,
				mReview: false,
				mRevoke: false,
				rSaveDraft: true,
				rSubmit: true,
				showEdit: false,
				prevPdf: false,
				prevAppPdf: false,
				advanceDD:true,
				process: "",
				claimId: "",
				count: 0,
				showDelayed: false,
				uploadClear: true,
				navbackDetail: false,
				headerRemarks: "",
				filesize: ""
			};
			this.getOwnerComponent().getModel("buttonsModel").setData(r);
			var s = {
				FileReaderIds: [],
				ApprovalFileReaderIds: [],
				oPDF: "",
				size: "",
				dataString: "",
				oPDFDelay: "",
				sizeDelay: "",
				dataStringDelay: ""
			};
			var o = this.getOwnerComponent().getModel("FileReaderModel");
			o.setData(s);
			var i = {
				PDFFiles: []
			};
			var n = this.getOwnerComponent().getModel("OriginalPdfFiles");
			n.setData(i);
			var l = this.getOwnerComponent().getModel("InitialModel");
			var d = this;
			sap.ui.core.BusyIndicator.show(0);
			l.read("/GetOverviewDataSet", {
				success: function (e) {
					sap.ui.core.BusyIndicator.hide();
					d.bindTable(e)
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide();
					t.show("Error Connecting odata service to backend")
				}
			})
			sap.ui.core.BusyIndicator.hide();
		},
		onNewClaimPress: function () {
			var e = "0";
			var t = this.getOwnerComponent().getModel("buttonsModel");
			t.setProperty("/process", "Create");
			t.setProperty("/showDelayed", false);
			this.getOwnerComponent().getRouter().navTo("object", {
				objectId: btoa(e)
			})
		},
		onSearch: function (e) {
			sap.ui.core.BusyIndicator.show(0);
			var t = this.getView().byId("inpClaim").getValue();
			t = parseInt(t);
			var o = this.getView().byId("selStatus").getSelectedKey();
			var i = this.getView().byId("fbDP").getProperty("dateValue");
			var n = this.getView().byId("fbDP2").getProperty("dateValue");
			var l = [];
			if (!!o) {
				if (o === "S") {
					var d = new r("Errfg", s.EQ, "X");
					l.push(d);
					var u = new r("Cstat", s.EQ, "N");
					l.push(u)
				} else if (o === "N") {
					var d = new r("Errfg", s.EQ, "");
					l.push(d);
					var u = new r("Cstat", s.EQ, o);
					l.push(u)
				} else {
					var d = new r("Cstat", s.EQ, o);
					l.push(d)
				}
			}
			if (!!t) {
				var g = new r("Refnr", s.Contains, t);
				l.push(g)
			}
			if (!!i) {
				var v = i.getDate();
				var f = i.getMonth();
				var h = i.getFullYear();
				var p = 5;
				var c = 30;
				var w = 0;
				var m = new Date(h, f, v, p, c, w);
				if (!!n) {
					var D = n.getDate();
					var M = n.getMonth();
					var b = n.getFullYear();
					var C = 5;
					var I = 30;
					var y = 0;
					var P = new Date(b, M, D, C, I, y)
				} else {
					n = new Date;
					D = n.getDate();
					M = n.getMonth();
					b = n.getFullYear();
					C = 5;
					I = 30;
					y = 0;
					P = new Date(b, M, D, C, I, y)
				}
				var S = new r("Rqcdt", s.BT, m, P);
				l.push(S);
				var V = new sap.ui.model.Sorter("Rqcdt", false)
			}
			if (!!n & !i) {
				a.alert("Please provide From Date as well!")
			}
			var R = this.getView().byId("tab1").getBinding("items");
			if (V) {
				R.sort(V)
			} else {
				R.sort(new sap.ui.model.Sorter("Rqcdt", true))
			}
			R.filter(l);
			sap.ui.core.BusyIndicator.hide()
		},
		onItemPress: function (e) {
			var t = e.getSource().getBindingContextPath();
			var a = this.getView().getModel("Initial").getProperty(t).Refnr;
			this.getOwnerComponent().getRouter().navTo("master", {
				claimId: btoa(a)
			})
		}
	})
});