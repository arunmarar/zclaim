sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment",
	"sap/m/MessageBox", "sap/m/MessageToast","sap/ui/model/Filter",	"sap/ui/model/FilterOperator"
], function (e, t, a, i, s, MessageBox, o,Filter,FilterOperator) {
	"use strict";
	var l = [];
	var d, n, g;
	var y = i.URLHelper;
	return e.extend("Furnishing.controller.Detail", {
		formatter: a,
		onInit: function () {
			var e = new t({
				busy: false,
				delay: 0
			});
			var a = this.getOwnerComponent().getModel("RouteModel");
			a.setProperty("/split", true);
			a.setProperty("/normal", false);
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(e, "detailView");
				var Model1 = new t();
				var lModel = this.getOwnerComponent().getModel("InitialModel");
	var	currView=this.getView();	
				
		lModel.read("/ItemCodeSet", {
				success: function (oData, response) {
					// var oResults = oData.results;

					var oResults = oData.results;

					Model1.setData(oResults);
					currView.setModel(Model1, "InitialModelItem");

				},
				error:function(oError)
				{
					MessageBox.show("Error Connecting odata service to backend")
				}
			});
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this))
		},
		_handleItemValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"DESCRIPTION",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
			this.emptyVal = evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleItemValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var itemCode = this.byId(this.id);
				var itemDesc=this.byId(this.id.replace("Code","Desc"));
				itemCode.setValue(oSelectedItem.getTitle());
				itemDesc.setValue(oSelectedItem.getInfo());
			} else {
				var itemCode1 = this.byId(this.id);
				var itemDesc1=this.byId(this.id.replace("Code","Desc"));
				itemDesc1.setValue(oSelectedItem.getTitle());
				itemCode1.setValue(oSelectedItem.getInfo());
			}

			evt.getSource().getBinding("items").filter([]);

		},
			onPressShowDialog: function (oEvent) {
			// var sInputValue, fragmentName;

			if (oEvent.getSource().getId().includes("itemCodeCAAdvanceCreate")) {
				this.id = "itemCodeCAAdvanceCreate";
				if (!this._oValueHelpDialogCAAdvance) {

					this._oValueHelpDialogCAAdvance = sap.ui.xmlfragment("Furnishing.view.ItemCode", this);
					this.getView().addDependent(this._oValueHelpDialogCAAdvance);
				}
				this._oValueHelpDialogCAAdvance.open();
			} else if (oEvent.getSource().getId().includes("itemCodeCAAdvanceEdit")) {
				this.id = "itemCodeCAAdvanceEdit";
				if (!this._oValueHelpDialogCAAdvance) {

					this._oValueHelpDialogCAAdvance = sap.ui.xmlfragment("Furnishing.view.ItemCode", this);
					this.getView().addDependent(this._oValueHelpDialogCAAdvance);
				}
				this._oValueHelpDialogCAAdvance.open();
			} else if (oEvent.getSource().getId().includes("itemCodeClaimEdit")) {
				this.id = "itemCodeClaimEdit";
				if (!this._oValueHelpDialogClaim) {

					this._oValueHelpDialogClaim = sap.ui.xmlfragment("Furnishing.view.ItemCode", this);
					this.getView().addDependent(this._oValueHelpDialogClaim);
				}
				this._oValueHelpDialogClaim.open();
			} else if (oEvent.getSource().getId().includes("itemCodeClaimCreate")) {
				this.id = "itemCodeClaimCreate";
				if (!this._oValueHelpDialogClaim) {

					this._oValueHelpDialogClaim = sap.ui.xmlfragment("Furnishing.view.ItemCode", this);
					this.getView().addDependent(this._oValueHelpDialogClaim);
				}
				this._oValueHelpDialogClaim.open();
			}

		},
		onChangeItemCode:function(e)
		{
		var itemDesc=	e.getSource().getProperty("selectedKey");
			var P=this.getOwnerComponent().getModel("buttonsModel").getProperty("/createoredit");
			if(P==="Create"){this.getView().byId("itemDescClaimCreate").setValue(itemDesc);}
				if(P==="Edit"){this.getView().byId("itemDescClaimEdit").setValue(itemDesc);}
		
		},
		onSendEmailPress: function () {
			var e = this.getModel("detailView");
			y.triggerEmail(null, e.getProperty("/shareSendEmailSubject"), e.getProperty("/shareSendEmailMessage"))
		},
		_onObjectMatched: function (e) {
			var t = e.getParameter("arguments").objectId;
			g = atob(t);
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			if (sap.ui.Device.system.phone) {
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/navbackDetail", true)
			} else {
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/navbackDetail", false)
			}
			var a = this.getOwnerComponent().getModel("RouteModel");
			a.setProperty("/split", true);
			a.setProperty("/normal", false);
			var r = this.getOwnerComponent().getModel("buttonsModel");
			
			var P = r.getProperty("/process");
			/*if(P==="Create")
			{
			this.getView().byId("itemName").setSelectedKey("");
			this.getView().byId("itemName").setEnabled(true);
			}
			if(P==="Edit")
			{
			this.getView().byId("itemName").setSelectedKey(this.getOwnerComponent().getModel("detailMasterModel").getData()[0].RQTYP);
			this.getView().byId("itemName").setEnabled(false);
			d="Create";
this.onItemSelection();			
			
			}*/
			if (g == "0") {
				d = "Create";
				var i = this.getView().byId("detailPage");
				i.removeAllContent();
				this.getView().byId("itemName").setSelectedKey("");
				l = [];
				var s = this.getOwnerComponent().getModel("detailMasterModel");
				s.setData(l);
				var r = this.getOwnerComponent().getModel("buttonsModel");
				r.setProperty("/rSaveDraft", true);
				r.setProperty("/rSubmit", true);
				r.setProperty("/mAdd", false);
				r.setProperty("/dSelect", true);
				r.setProperty("/mReview", false);
				r.setProperty("/dAdd", true);
				r.setProperty("/dSave", false);
				r.setProperty("/dClear", true);
				r.setProperty("/dEdit", false);
				r.setProperty("/dSelect", true);
				r.setProperty("/rDelete",false);
				r.setProperty("/mDelete", false)
			} else if (g == "1") {
				d = "Create";
				var i = this.getView().byId("detailPage");
				i.removeAllContent();
				//this.getView().byId("itemName").setSelectedKey("");
				var r = this.getOwnerComponent().getModel("buttonsModel");
				r.setProperty("/dAdd", true);
				r.setProperty("/dSave", false);
				r.setProperty("/dClear", true);
				r.setProperty("/dEdit", false);
				r.setProperty("/dSelect", true);
				r.setProperty("/mDelete", false)
				this.onItemSelection();
			} else {
				this.ItemDisplay()
			}
		},
		ItemDisplay: function () {
			var e = this.getOwnerComponent().getModel("buttonsModel");
			e.setProperty("/dAdd", false);
			e.setProperty("/dSave", false);
			e.setProperty("/dClear", false);
			e.setProperty("/dSelect", false);
			var t = e.getProperty("/showEdit");
			if (!t) {
				e.setProperty("/dEdit", false);
				e.setProperty("/mDelete", false)
			} else {
				e.setProperty("/mAdd", true);
				e.setProperty("/dEdit", true);
				e.setProperty("/mDelete", true)
			}
			d = "Display";
			l = this.getOwnerComponent().getModel("detailMasterModel").getData();

			n = this.getOwnerComponent().getModel("detailMasterModel").getObject(g).RQTYP;
			switch (n) {
			case "AD":
				n = "Advance";
				
				break;
			case "CA":
			
			 var asref=this.getOwnerComponent().getModel("detailMasterModel").getObject(g).ASREF;
			this.getOwnerComponent().getModel("buttonsModel").setProperty("/asref",asref);
				n = "ClaimAgainstAdvance";
				break;
			case "CL":
				n = "Claim";
				break;
		
			
			}
			
			var i = n + d;
			this._showFormFragment(i);
			var s = this.getView().byId("form" + i);
			s.bindElement("detailMasterModel>" + g)
		},
		_onMetadataLoaded: function () {
			var e = this.getView().getBusyIndicatorDelay(),
				t = this.getModel("detailView");
			t.setProperty("/delay", 0);
			t.setProperty("/busy", true);
			t.setProperty("/delay", e)
		},
		onItemSelection: function (e) {
			
			var a = this.getView().byId("itemName").getSelectedItem();
			if (a !== null ) {
				var t = this.getView().byId("itemName").getSelectedItem().getText();
				if(t==="Advance")
				{
					var data=this.getOwnerComponent().getModel("detailMasterModel").getData();
					var count=0;
					var len=this.getOwnerComponent().getModel("detailMasterModel").getData().length;
					for(var i=0;i<len;i++)
					{
					if(data[i].RQTYP==="AD")
					{
						count++;
					}
					}
					if(count>=1)
			 {
				MessageBox.alert("You can add only one advance....");
				return;
			 } 
				}
			if (t == "Claim against Advance") {
				t = "ClaimAgainstAdvance"
			} else if (t == "") {
				return
			}
			
			t = t + d;
			
			this._showFormFragment(t);
			// this.getView().byId("billDateCAAdvanceCreate").setMaxDate(new Date());
			// 	this.getView().byId("billDateCAAdvanceEdit").setMaxDate(new Date());
			// 		this.getView().byId("billDateClaimCreate").setMaxDate(new Date());
			// 	this.getView().byId("billDateClaimEdit").setMaxDate(new Date());
			this.formatdate(a);
			this.getOwnerComponent().getModel("buttonsModel").setProperty("/createoredit", "Create");
			}
		},
		_formFragments: {},
		_showFormFragment: function (e) {
			var t = this.getView().byId("detailPage");
			t.removeAllContent();
			t.insertContent(this._getFormFragment(e))
		},
		_getFormFragment: function (e) {
			var t = this._formFragments[e];
			if (t) {
				return t
			}
			var t = sap.ui.xmlfragment(this.getView().getId(), "Furnishing.view." + e, this);
			this._formFragments[e] = t;
			return this._formFragments[e]
		},

		formatdate: function (e) {
			var len=this.getOwnerComponent().getModel("detailMasterModel").getData().length;
			switch (e.getText()) {
			case "Advance":
			
			 break;
			case "Claim":
				this.getView().byId("billDateClaimCreate").setMaxDate(new Date);
				
			
				break;
			case "Claim against Advance":
			 if(len>=1)
			 {
				 this.getOwnerComponent().getModel("buttonsModel").setProperty("/advanceDD",false);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/dClaimA",true); 
				//var advance=this.getOwnerComponent().getModel("detailMasterModel").getData()[0].ASREF;
			 }
				var bol=this.getOwnerComponent().getModel("buttonsModel").getProperty("/advanceDD");
				if(bol===true)
				{
					this.getView().byId("advanceCAAdvanceCreate").setSelectedKey("");
				}
				this.getView().byId("billDateCAAdvanceCreate").setMaxDate(new Date);
				break;
		
		
			}
		},
		onchangeNextDate: function (e) {
			var t = this;
			var a = e.getSource();
			t._validateInput(a);
			var i = e.getSource().getProperty("dateValue");
			var s = e.getSource().getId().slice(53);
			switch (s) {
			case "hDateFrom":
				this.getView().byId("hDateTo").setMinDate(i);
				break;
			case "hDateFromE":
				this.getView().byId("hDateToE").setMinDate(i);
				break;
			case "teDepDate":
				this.getView().byId("teArvlDate").setMinDate(i);
				break;
			case "teDepDateE":
				this.getView().byId("teArvlDateE").setMinDate(i);
				break
			}
		},
		onConsultationTypeChange: function (e) {
			sap.ui.core.BusyIndicator.show(0);
			var t = e.getSource().getSelectedKey();
			var a = this.getOwnerComponent().getModel("InitialModel");
			if (t === "CD") {
				this.getView().byId("cReqAmt").setEditable(false);
				this.getView().byId("cReqAmt").setValue("0")
			} else {
				this.getView().byId("cReqAmt").setEditable(true);
				this.getView().byId("cReqAmt").setValue("")
			}
			var i = this;
			var s = [];
			var o = new sap.ui.model.Filter("Soval", sap.ui.model.FilterOperator.EQ, t);
			s.push(o);
			a.read("/F4_DOC_CATSet", {
				filters: s,
				success: function (e) {
					sap.ui.core.BusyIndicator.hide();
					var t = i.getOwnerComponent().getModel("docModel");
					t.setData(e.results);
					i.getView().byId("cDocCatalog").setModel(t, "docModel")
				},
				error: function (e) {
					MessageBox.error("Error while loading doc Catalog.");
					sap.ui.core.BusyIndicator.hide()
				}
			});
			if (t) {
				e.getSource().setValueState("None")
			} else {
				e.getSource().setValueState("Error")
			}
		},
		onConsultationTypeEdit: function (e) {
			sap.ui.core.BusyIndicator.show(0);
			var t = e.getSource().getSelectedKey();
			var a = this.getOwnerComponent().getModel("InitialModel");
			if (t === "CD") {
				this.getView().byId("cReqAmtE").setEditable(false);
				this.getView().byId("cReqAmtE").setValue("0")
			} else {
				this.getView().byId("cReqAmtE").setEditable(true);
				this.getView().byId("cReqAmtE").setValue("")
			}
			var i = this;
			var s = [];
			var o = new sap.ui.model.Filter("Soval", sap.ui.model.FilterOperator.EQ, t);
			s.push(o);
			a.read("/F4_DOC_CATSet", {
				filters: s,
				success: function (e) {
					sap.ui.core.BusyIndicator.hide();
					var t = i.getOwnerComponent().getModel("docModel");
					t.setData(e.results);
					i.getView().byId("cDocCatalogE").setModel(t, "docModel")
				},
				error: function (e) {
					MessageBox.error("Error while loading doc Catalog.");
					sap.ui.core.BusyIndicator.hide()
				}
			});
			if (t) {
				e.getSource().setValueState("None")
			} else {
				e.getSource().setValueState("Error")
			}
		},
		onOtherClaimTypeChange: function (e) {
			var t = e.getSource().getSelectedKey();
			if (t) {
				e.getSource().setValueState("None")
			} else {
				e.getSource().setValueState("Error")
			}
			if (t === "OT") {
				this.getView().byId("otherFreeText").setVisible(true);
				this.getView().byId("otherFreeText").setValue("")
			} else {
				this.getView().byId("otherFreeText").setVisible(false);
				this.getView().byId("otherFreeText").setValue("")
			}
		},
		onOtherClaimTypeChangeEdit: function (e) {
			var t = e.getSource().getSelectedKey();
			if (t) {
				e.getSource().setValueState("None")
			} else {
				e.getSource().setValueState("Error")
			}
			if (t === "OT") {
				this.getView().byId("otherFreeTextE").setVisible(true);
				this.getView().byId("otherFreeTextE").setValue("")
			} else {
				this.getView().byId("otherFreeTextE").setVisible(false);
				this.getView().byId("otherFreeTextE").setValue("")
			}
		},
	onSave: function () {
			var e = this.getOwnerComponent().getModel("detailMasterModel").getObject(g).RQTYP;
			var t = false;
			var a = this;
		
				switch (e) {
			case "AD":
			var data=this.getOwnerComponent().getModel("detailMasterModel").getData();
				var l = this.getView().byId("selectHODAdvanceEdit").getSelectedKey();
				var l1 = this.getView().byId("selectHODAdvanceEdit").getSelectedItem().getText();
				for(var j=0;j<data.length;j++){
					if(data[j].RQTYP==="AD")
				data[j].C40T3=l1;
				data[j].C20T5=l;
				}
			//	var s = this.onChangeDecimal(this.getView().byId("reqAmtAdvanceEdit").getValue());
				var i = [	this.getView().byId("reqAmtAdvanceEdit"), this.getView().byId("selectHODAdvanceEdit")
				];
				jQuery.each(i, function (e, i) {
					t = a._validateInput(i) || t
				});
				if (t) {
					MessageBox.alert("Please Fill All Input Fields.");
					return
				}
				// var o = new Date(s);
				// o.setMinutes(30);
				// o.setHours(5);
				// s = o;
				// this.getView().byId("billDateCAAdvanceEdit").setProperty("dateValue", s);
					
				
				this.getView().byId("selectHODAdvanceEdit").setSelectedKey(l);
				this.getView().byId("selectHODAdvanceEdit").setSelectedItem().setValue(l1);
				break;
			case "CA":
			var asref=	this.getView().byId("advanceCAAdvanceEdit").getSelectedKey();
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/asref",asref);
				var s = this.getView().byId("billDateCAAdvanceEdit").getProperty("dateValue");
					//var l = this.getView().byId("itemCodeCAAdvanceEdit").getValue();
				var i = [	this.getView().byId("reqAmtCAAdvanceEdit"),
			this.getView().byId("billDateCAAdvanceEdit"),
				this.getView().byId("itemCodeCAAdvanceEdit"),
				
				this.getView().byId("numItemCAAdvanceEdit"),
				 this.getView().byId("billNumCAAdvanceEdit"),
				
			 
			
			 this.getView().byId("billSAmtCAAdvanceEdit")];
				jQuery.each(i, function (e, i) {
					t = a._validateInput(i) || t
				});
				if (t) {
					MessageBox.alert("Please Fill All Input Fields.");
					return
				}
				var o = new Date(s);
				o.setMinutes(30);
				o.setHours(5);
				s = o;
				this.getView().byId("billDateCAAdvanceEdit").setProperty("dateValue", s);
			//	 this.getView().byId("itemCodeCAAdvanceEdit").setValue(l);
				// this.getView().byId("itemDescCAAdvanceEdit").setValue(ldesc);
				break;
		case "CL":
				var s = this.getView().byId("billDateClaimEdit").getProperty("dateValue");
					//var l = this.getView().byId("itemCodeClaimEdit").getValue();
					//var ldesc = this.getView().byId("itemDescClaimEdit").getValue();
				var i = [	this.getView().byId("reqAmtClaimEdit"),
			this.getView().byId("billDateClaimEdit"),
				this.getView().byId("itemCodeClaimEdit"),
				 
				this.getView().byId("numItemClaimEdit"),
				 this.getView().byId("billNumClaimEdit"),
				 
			 this.getView().byId("billSAmtClaimEdit")];
				jQuery.each(i, function (e, i) {
					t = a._validateInput(i) || t
				});
				if (t) {
					MessageBox.alert("Please Fill All Input Fields.");
					return
				}
				var o = new Date(s);
				o.setMinutes(30);
				o.setHours(5);
				s = o;
				this.getView().byId("billDateClaimEdit").setProperty("dateValue", s);
					// this.getView().byId("itemCodeClaimEdit").setValue(l);
				 //this.getView().byId("itemDescClaimEdit").setValue(ldesc);
				break
			}
			
			var u = this.getOwnerComponent().getModel("buttonsModel");
			u.setProperty("/dEdit", true);
			u.setProperty("/mAdd", true);
			u.setProperty("/mAttach", true);
			u.setProperty("/mDelete", true);
			if (sap.ui.Device.system.desktop) {
				this.ItemDisplay()
			} else {
				this.onCloseDetailPress();
				var u = this.getOwnerComponent().getModel("buttonsModel");
				u.setProperty("/dAdd", false);
				u.setProperty("/dSave", false);
				u.setProperty("/dClear", false);
				u.setProperty("/dSelect", false)
			}
		},
		onChangeDecimal:function(e)
		{
				var t = this;
			// var a = e.getSource();
			// t._validateInput(a);
		//	var i = e.getSource().getProperty("dateValue");
			var s = e.getSource().getId().slice(58);
			var t = e.getParameter("value").length;	
			var d=0;
			if(e.getParameter("value").includes("."))
			{
				d=e.getParameter("value").split(".")[1].length;
			}
			var P=this.getOwnerComponent().getModel("buttonsModel").getProperty("/createoredit");
		
			
			if(P==="Create")
			{
		
			var reqAmt =this.getView().byId(s).getValue();
			
		
			
			if (t > 15 || d>2) {
				this.getView().byId(s).setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId(s).setValue("");
			} else {
				this.getView().byId(s).setValueState(sap.ui.core.ValueState.None);
				
			}
		
			}
			else
			{
				var reqAmt =this.getView().byId(s).getValue();
			
		
			
			if (t > 15 || d>2) {
				this.getView().byId(s).setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId(s).setValue("");
			} else {
				this.getView().byId(s).setValueState(sap.ui.core.ValueState.None);
				
			}	
			}
			},
		onEdit: function (e) {
			var t = n + "Edit";
			var a = this.getView().byId("detailPage");
			a.removeAllContent();
			var i = this._formFragments[t];
			if (i) {
				a.insertContent(i)
			} else {
				var i = sap.ui.xmlfragment(this.getView().getId(), "Furnishing.view." + t, this);
				this._formFragments[t] = i;
				a.insertContent(this._formFragments[t])
			}
			var s = this.getView().byId("form" + t);
			s.bindElement("detailMasterModel>" + g);
			switch (n) {
			
			case "ClaimAgainstAdvance":
				this.getView().byId("billDateCAAdvanceEdit").setMaxDate(new Date());
				break;
			case "Claim":
			this.getView().byId("billDateClaimEdit").setMaxDate(new Date());
				break
			}
			var c = this.getOwnerComponent().getModel("buttonsModel");
			c.setProperty("/dAdd", false);
			c.setProperty("/dSave", true);
			c.setProperty("/dClear", false);
			c.setProperty("/dEdit", false);
			c.setProperty("/dSelect", false);
			c.setProperty("/mAdd", false);
			c.setProperty("/mAttach", false);
			c.setProperty("/mDelete", false)
		},
		clearData: function () {
			var e = this.getView().byId("itemName").getSelectedKey();
			switch (e) {
			case "AD":
			var c = this.getOwnerComponent().getModel("buttonsModel");
				this.getView().byId("selectHODAdvanceCreate").setSelectedKey("");
				this.getView().byId("reqAmtAdvanceCreate").setValue("");
				c.setProperty("/mAdd",false);
				break;
			case "CA":
				
				var c = this.getOwnerComponent().getModel("buttonsModel");
			c.setProperty("/dClaimA", false);
				//this.getView().byId("advanceCAAdvanceCreate").setSelectedKey("");
				this.getView().byId("itemCodeCAAdvanceCreate").setSelectedKey("");
			//	this.getView().byId("itemDescCAAdvanceCreate").setValue("");
				this.getView().byId("numItemCAAdvanceCreate").setValue("");
				this.getView().byId("billNumCAAdvanceCreate").setValue("");
				this.getView().byId("gstNumCAAdvanceCreate").setValue("");
				this.getView().byId("gstNumVCAAdvanceCreate").setValue("");
				this.getView().byId("gstTaxRateCAAdvanceCreate").setValue("");
				this.getView().byId("baseValueCAAdvanceCreate").setValue("");
				this.getView().byId("cgstCAAdvanceCreate").setValue("");
				this.getView().byId("ugstCAAdvanceCreate").setValue("");
				this.getView().byId("sgstCAAdvanceCreate").setValue("");
				this.getView().byId("igstCAAdvanceCreate").setValue("");
				this.getView().byId("hsnCodeCAAdvanceCreate").setValue("");
				this.getView().byId("venNameCAAdvanceCreate").setValue("");
				this.getView().byId("billSAmtCAAdvanceCreate").setValue("");
				this.getView().byId("reqAmtCAAdvanceCreate").setValue("");
				this.getView().byId("billDateCAAdvanceCreate").setValue("");
				break;
			case "CL":
					this.getView().byId("itemCodeClaimCreate").setSelectedKey("");
				this.getView().byId("itemDescClaimCreate").setValue("");
				this.getView().byId("numItemClaimCreate").setValue("");
				this.getView().byId("billNumClaimCreate").setValue("");
				this.getView().byId("gstNumClaimCreate").setValue("");
				this.getView().byId("gstNumVClaimCreate").setValue("");
				this.getView().byId("gstTaxRateClaimCreate").setValue("");
				this.getView().byId("baseValueClaimCreate").setValue("");
				this.getView().byId("cgstClaimCreate").setValue("");
				this.getView().byId("ugstClaimCreate").setValue("");
				this.getView().byId("sgstClaimCreate").setValue("");
				this.getView().byId("igstClaimCreate").setValue("");
				this.getView().byId("hsnCodeClaimCreate").setValue("");
				this.getView().byId("venNameClaimCreate").setValue("");
				this.getView().byId("billSAmtClaimCreate").setValue("");
				this.getView().byId("reqAmtClaimCreate").setValue("");
				this.getView().byId("billDateClaimCreate").setValue("");
			
				
				break;
		
			}
		},
		_validateInput: function (e) {
			var t = "None";
			var a = false;
			var i = e.getMetadata().getName();
			if (!e.getVisible()) return;
			if (i === "sap.m.Select") {
				if (!e.getSelectedKey()) {
					t = "Error";
					a = true
				}
			} else if (i === "sap.m.Input") {
				if (!e.getValue()) {
					t = "Error";
					a = true
				}
			} else if (i === "sap.m.DatePicker") {
				if (!e.getValue()) {
					t = "Error";
					a = true
				}
			}
			e.setValueState(t);
			return a
		},
		ontextChange: function (e) {
			var t = this;
			var a = e.getSource();
			t._validateInput(a)
		},
	putDecimal:function(s){
		
		var s1;
						if(s.includes("."))
						{
							s1 = s;
						}
						else
				{
					if(s==="")
					{
						s1="0.00"
					}
				else{
					s1=s+".00";
				}
				}
				return s1;
		},
		onAddItem: function () {
			var e = this.getView().byId("itemName").getSelectedKey();
		//var l = [];
			//	var e1= this.getView().byId("finYearDetail").getSelectedKey();
			var x = this.getOwnerComponent().getModel("detailMasterModel");
			var r1 = this.getOwnerComponent().getModel("buttonsModel");
				var	m =  r1.getProperty("/claimId");
				r1.setProperty("/claimType",e);

			var t = false;
			var a = this;
			switch (e) {
			case "":
				MessageBox.show("Please select Request Type!", {
					title: "Dear User"
				});
				return;
				break;
			case "AD":
				
				var i = [this.getView().byId("reqAmtAdvanceCreate"), this.getView().byId("selectHODAdvanceCreate")];
				jQuery.each(i, function (e, i) {
					t = a._validateInput(i) || t
				});
				if (t) {
					MessageBox.alert("Please Fill All Input Fields.");
					return
				}
				var s = this.putDecimal(this.getView().byId("reqAmtAdvanceCreate").getValue());
				// 			if(s.includes("."))
				// 		{
				// 			s = this.getView().byId("billAmt").getValue();
				// 		}
				// 		else
				// {
				// 	s=s+".00";
				// }
				var o = this.getView().byId("selectHODAdvanceCreate").getSelectedKey();
				var o1 = this.getView().byId("selectHODAdvanceCreate").getSelectedItem().getText();
			//	var r = this.getOwnerComponent().getModel("buttonsModel");

			
			
			
				var b = {
					
					
					RQAMT: s,
					C40T3:o1,
					LINUM: "",
					RQTYP:e,
					REFNR:m,
					CSTAT:"N",
					C20T5: o
				};
				l.push(b);
			

		
				break;
			case "CA":
			
			var len=this.getOwnerComponent().getModel("detailMasterModel").getData().length;
			if(len>1)
			{
				var advance=this.getOwnerComponent().getModel("detailMasterModel").getData()[0].ASREF;
				this.getView().byId("advanceCAAdvanceCreate").setSelectedKey(advance);
				this.getView().byId("advanceCAAdvanceCreate").setEnabled(false);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/dClaimA",true);
				
			}
					var advance = this.getView().byId("advanceCAAdvanceCreate").getSelectedItem();
					if(advance===null)
					{
					MessageBox.error("Please select atleast one advance bill");	
					}
				var RQAMT = this.putDecimal(this.getView().byId("reqAmtCAAdvanceCreate").getValue());
				var o = this.getView().byId("billDateCAAdvanceCreate").getProperty("dateValue");
				var itemCode = this.getView().byId("itemCodeCAAdvanceCreate").getValue();
				var itemDesc = this.getView().byId("itemDescCAAdvanceCreate").getValue();
				var numOfItems = this.getView().byId("numItemCAAdvanceCreate").getValue();
				var billNum = this.getView().byId("billNumCAAdvanceCreate").getValue();
				var gstGail = this.getView().byId("gstNumCAAdvanceCreate").getValue();
				var gstVendor = this.getView().byId("gstNumVCAAdvanceCreate").getValue();
				var gstTaxRate =this.putDecimal( this.getView().byId("gstTaxRateCAAdvanceCreate").getValue());
				var cgst = this.putDecimal(this.getView().byId("cgstCAAdvanceCreate").getValue());
				var igst = this.putDecimal(this.getView().byId("igstCAAdvanceCreate").getValue());
				var sgst = this.putDecimal(this.getView().byId("sgstCAAdvanceCreate").getValue());
				var ugst = this.putDecimal(this.getView().byId("ugstCAAdvanceCreate").getValue());
				var baseValue = this.putDecimal(this.getView().byId("baseValueCAAdvanceCreate").getValue());
				var hsn = this.getView().byId("hsnCodeCAAdvanceCreate").getValue();
				var vName = this.getView().byId("venNameCAAdvanceCreate").getValue();
				var billSettelmentAmt = this.putDecimal(this.getView().byId("billSAmtCAAdvanceCreate").getValue());
			
				var i = [
					this.getView().byId("reqAmtCAAdvanceCreate"),
			this.getView().byId("billDateCAAdvanceCreate"),
				this.getView().byId("itemCodeCAAdvanceCreate"),
				 this.getView().byId("billNumCAAdvanceCreate"),
				this.getView().byId("numItemCAAdvanceCreate"),
			 this.getView().byId("billSAmtCAAdvanceCreate")
					];
				jQuery.each(i, function (e, i) {
					t = a._validateInput(i) || t
				});
				if (t) {
					MessageBox.alert("Please Fill All Input Fields.");
					return
				}
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/asref",this.getView().byId("advanceCAAdvanceCreate").getSelectedKey());
				var V = new Date(o);
				V.setMinutes(30);
				V.setHours(5);
				o = V;
				var b = {
					LINUM: "",
					RQTYP:e,
					REFNR:m,
					CSTAT:"N",
					RQAMT: RQAMT,
					ASREF:this.getView().byId("advanceCAAdvanceCreate").getSelectedKey(),
					APAMT: "0.00",
					CDT01: o,
					C10T5: itemCode,
					C20T1: billNum,
					C20T2: hsn,
					C40T1: gstVendor,
					C40T2: numOfItems,
				//	C40T3: itemDesc,
					//C40T4: gstGail,
					C40T5: gstGail,
					C40T3:itemDesc,
					C40T3_V:vName,
					AMT01: billSettelmentAmt,
					AMT02: cgst,
					AMT03: ugst,
					AMT04: sgst,
					AMT05: igst,
					AMT06: baseValue,
					AMT07: gstTaxRate,
					
				};
				l.push(b);
				break;
			case "CL":
			
					var RQAMT = this.putDecimal(this.getView().byId("reqAmtClaimCreate").getValue());
				var o = this.getView().byId("billDateClaimCreate").getProperty("dateValue");
				var itemCode = this.getView().byId("itemCodeClaimCreate").getValue();
				var itemDesc = this.getView().byId("itemDescClaimCreate").getValue();
				var numOfItems = this.getView().byId("numItemClaimCreate").getValue();
				var billNum = this.getView().byId("billNumClaimCreate").getValue();
				var gstGail = this.getView().byId("gstNumClaimCreate").getValue();
				var gstVendor = this.getView().byId("gstNumVClaimCreate").getValue();
				var gstTaxRate = this.putDecimal(this.getView().byId("gstTaxRateClaimCreate").getValue());
				var cgst = this.putDecimal(this.getView().byId("cgstClaimCreate").getValue());
				var igst = this.putDecimal(this.getView().byId("igstClaimCreate").getValue());
				var sgst = this.putDecimal(this.getView().byId("sgstClaimCreate").getValue());
				var ugst = this.putDecimal(this.getView().byId("ugstClaimCreate").getValue());
				var baseValue = this.putDecimal(this.getView().byId("baseValueClaimCreate").getValue());
				var hsn = this.getView().byId("hsnCodeClaimCreate").getValue();
				var vName = this.getView().byId("venNameClaimCreate").getValue();
				var billSettelmentAmt = this.putDecimal(this.getView().byId("billSAmtClaimCreate").getValue());
			
				var i = [
					this.getView().byId("reqAmtClaimCreate"),
			this.getView().byId("billDateClaimCreate"),
				this.getView().byId("itemCodeClaimCreate"),
				
				this.getView().byId("numItemClaimCreate"),
				 this.getView().byId("billNumClaimCreate"),
				
				
			 this.getView().byId("billSAmtClaimCreate")
					];
				jQuery.each(i, function (e, i) {
					t = a._validateInput(i) || t
				});
				if (t) {
					MessageBox.alert("Please Fill All Input Fields.");
					return
				}

				var V = new Date(o);
				V.setMinutes(30);
				V.setHours(5);
				o = V;
				var b = {
					// RQTYP: e,
					LINUM: "",
					RQTYP:e,
					REFNR:m,
					CSTAT:"N",
					RQAMT: RQAMT,
					APAMT: "0.00",
					CDT01: o,
					C10T5: itemCode,
					C20T1: billNum,
					C20T5: hsn,
					C40T1: vName,
					C40T2: numOfItems,
					C40T3: itemDesc,
					C40T4: gstGail,
					C40T5: gstVendor,
					AMT01: billSettelmentAmt,
					AMT02: cgst,
					AMT03: ugst,
					AMT04: sgst,
					AMT05: igst,
					AMT06: baseValue,
					AMT07: gstTaxRate,
				};
				l.push(b);
				break;
				
			
			}
			var x = this.getOwnerComponent().getModel("detailMasterModel");
			x.setData(l);
			

		 
			
			this.clearData();
			this.getView().byId("itemName").setEnabled(false);
			if (sap.ui.Device.system.desktop) {
				var N = this.getView().byId("detailPage");
				N.removeAllContent();
				var k = this.getOwnerComponent().getModel("buttonsModel");
				k.setProperty("/mAdd", true);
				k.setProperty("/mAttach", true);
				k.setProperty("/showEdit", true);
				this.onCloseDetailPress()
			} else {
				var k = this.getOwnerComponent().getModel("buttonsModel");
				k.setProperty("/mAdd", true);
				k.setProperty("/mAttach", true);
				k.setProperty("/showEdit", true);
				this.onCloseDetailPress()
			}
		},
		onChangeCAAdvance:function(){
			this.getOwnerComponent().getModel("buttonsModel").setProperty("/dClaimA", true);
		},
		onCloseDetailPress: function () {
			var e = this.getView().byId("detailPage");
			e.removeAllContent();
			this.getModel("appView").setProperty("/layout", "OneColumn");
			var t = "0";
			this.getOwnerComponent().getRouter().navTo("master", {
				claimId: btoa(t)
			})
		},
		OnTaxSelection: function (e) {
			var t = e.getParameter("selectedItem").getText();
			var a = e.getSource().getProperty("selectedKey");
			if (a == "Yes") {
				var i = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.information("Please attached requisite supporting document(s) for Tax exemption.", {
					styleClass: i ? "sapUiSizeCompact" : ""
				})
			}
		},
		onDeleteM: function (e) {
			var t = this.getView().byId("form" + n + "Display").getElementBinding("detailMasterModel").getPath();
			t = t.toString();
			t = t.slice(1);
			var a = parseInt(t);
			var i = a - 1;
			i = i.toString();
			i = "/" + i;
			var s = this.getOwnerComponent().getModel("detailMasterModel").oData;
			var o = s.length;
			if (o == t || !t) {
				MessageBox.information("Please select a record to delete!", {
					title: "Alert"
				});
				return
			}
			s.splice(t, 1);
			this.getOwnerComponent().getModel("detailMasterModel").setData(s);
			if (s.length === 0) {
				this.getView().byId("itemName").setSelectedKey("");
				this.getView().byId("itemName").setEnabled(true);
				var l = this.getOwnerComponent().getModel("buttonsModel");
				l.setProperty("/mDelete", false);
				l.setProperty("/mAttach", false);
				l.setProperty("/dEdit", false)
			}
			this.onCloseDetailPress()
		},
		onLiveReqAmt2: function (e) {
		// 	var t = e.getParameter("value").length;
		// 	var d = 0;
		// 	if (e.getParameter("value").includes(".")) {
		// 		d = e.getParameter("value").split(".")[1].length;
		// 	}
		// 	var P = this.getOwnerComponent().getModel("buttonsModel").getProperty("/createoredit");

		// 	if (P === "Create") {

		// 		var reqAmt = this.getView().byId("reqAmtAdvanceCreate").getValue();

		// 		if (t > 20 || d > 2) {
		// 			this.getView().byId("reqAmtAdvanceCreate").setValueState(sap.ui.core.ValueState.Error);
		// 			this.getView().byId("reqAmtAdvanceCreate").setValue("");
		// 		} else {
		// 			this.getView().byId("reqAmtAdvanceCreate").setValueState(sap.ui.core.ValueState.None);

		// 		}

		// 	} else {
		// 		var reqAmt = this.getView().byId("reqAmtEdit").getValue();

		// 		if (t > 20 || d > 2) {
		// 			this.getView().byId("reqAmtEdit").setValueState(sap.ui.core.ValueState.Error);
		// 			this.getView().byId("reqAmtEdit").setValue("");
		// 		} else {
		// 			this.getView().byId("reqAmtEdit").setValueState(sap.ui.core.ValueState.None);

		// 		}
		// 	}
		// },
		// toggleFullScreen: function () {
		// 	var e = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
		// 	this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !e);
		// 	if (!e) {
		// 		this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
		// 		this.getModel("appView").setProperty("/layout", "MidColumnFullScreen")
		// 	} else {
		// 		this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"))
		// 	}
		},
		onLiveReqAmt: function (e) {
			var t = e.getParameter("value").length;
			var a = this.getView().byId("addBtn");
			var i = this.getView().byId("saveBtn");
			var s = e.getParameter("id").slice(34);
			if (t > 10) {
				this.getView().byId(s).setValueState(sap.ui.core.ValueState.Error);
				a.setEnabled(false);
				i.setEnabled(false)
			} else {
				this.getView().byId(s).setValueState(sap.ui.core.ValueState.None);
				a.setEnabled(true);
				i.setEnabled(true)
			}
		}
	})
});