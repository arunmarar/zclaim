sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/MessagePopoverItem", "sap/m/MessagePopover", "sap/m/GroupHeaderListItem",
	"sap/m/MessageBox", "sap/ui/model/Filter","sap/ui/model/FilterOperator"
], function (e, a, r, o, f, q, x, i, mess,Filter,FilterOperator) {
	"use strict";

	var n = "";
	var s = false;
	var l = false;
	var d, g = "none";
	var p = new q({
		type: "{type}",
		title: "{Message}",
		description: "{Message}"
	});
	var v = new x({
		items: {
			path: "/",
			template: p
		},
		activeTitlePress: function () {
			i.show("Active title is pressed");
		}
	});
	return e.extend("Furnishing.controller.Review", {
			formatter: f,
		onInit: function () {
			this.toData1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/YHR_FURNISHING_SRV");
			this.getOwnerComponent().getRouter().getRoute("review").attachPatternMatched(this._onAttachmentMatched, this)
		},
		_onAttachmentMatched: function () {
			sap.ui.core.BusyIndicator.hide();
			this.getOwnerComponent().getModel("buttonsModel").setProperty("/CAadvanceReview",false);
			this.getOwnerComponent().getModel("buttonsModel").setProperty("/ClaimReview",false);
			this.getOwnerComponent().getModel("buttonsModel").setProperty("ClaimAndCAReview",false);
			this.getOwnerComponent().getModel("buttonsModel").setProperty("/advanceReview",false);
			this.getOwnerComponent().getModel("buttonsModel").setProperty("/rPrint", false);
			
			this.getView().byId("errorBtn").setVisible(false);
			this.getView().getModel("appView").setProperty("/layout", "OneColumn");
			var t = this.getOwnerComponent().getModel("RouteModel");
			t.setProperty("/split", false);
			t.setProperty("/normal", true);
			var hodModel=this.getOwnerComponent().getModel("hod").getData(); //CODE DESCRIPTION
			var r = this.getOwnerComponent().getModel("detailMasterModel");
			
			
			var a = r.getData().length;
			n = 0;
			for (var i = 0; i < a; i++) {
				var s = r.getObject("/" + i).RQAMT;
				s = parseFloat(s);
				n = n + s
			}
				
					if(n.toString().includes("."))
				{
					n = n;
				}
				else
		{
			n=n.toString()+".00";
		}
			var type=r.getData()[0].RQTYP;
			if(type==="CA")
			{	
		
		this.getOwnerComponent().getModel("buttonsModel").setProperty("/ClaimAndCAReview",true);
		this.getOwnerComponent().getModel("buttonsModel").setProperty("/advanceReview",false);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/CAadvanceReview",true);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/ClaimReview",false);
			
			}
			if(type==="CL")
			{
				if(r.getData()[0].CSTAT==="N"){
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/rPrint", false);
				}
				else{
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/rPrint", true);	
				}
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/ClaimAndCAReview",true);
		this.getOwnerComponent().getModel("buttonsModel").setProperty("/advanceReview",false);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/ClaimReview",true);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/CAadvanceReview",false);
			}
			if(type==="AD")
			{	//r.getData()[0].C40T3= r.getData()[0].C20T5;
				//r.getData()[0].C20T5="";

					if(r.getData()[0].C40T3=== undefined || r.getData()[0].C40T3=== "" ||r.getData()[0].C40T3==="00000000"){
				var value=r.getData()[0].C20T5;
				r.getData()[0].C40T3 = value;
			}
				for (var j = 0; j < a; j++) {
			var c40t3=r.getObject("/" + j).C40T3;
					for(var i=0;i<hodModel.length;i++)
					{
						if(c40t3===hodModel[i].DESCRIPTION)
						{
							var value=hodModel[i].CODE;
							r.getObject("/" + j).C20T5=value;
							
						}
					}
			
		}
		this.getView().byId("reviewTable").setModel(r, "detailMasterModel");
		this.getView().byId("reviewTable").getBinding("items").refresh();
		if(type==="AD")
			{
					for (var j = 0; j < a; j++) {
			var C20T5=r.getObject("/" + j).C20T5;
					for(var i=0;i<hodModel.length;i++)
					{
						if(C20T5===hodModel[i].CODE)
						{
							var value=hodModel[i].DESCRIPTION;
							r.getObject("/" + j).C40T3=value;
							
						}
					}
			
		}
			}
				
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/ClaimAndCAReview",false);
		this.getOwnerComponent().getModel("buttonsModel").setProperty("/advanceReview",true);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/ClaimReview",false);
				this.getOwnerComponent().getModel("buttonsModel").setProperty("/CAadvanceReview",false);
				
			}
			 var p = this.getOwnerComponent().getModel("FileReaderModel");
            var v = p.getProperty("/size");
           // var u = o.getProperty("/filesize");
            var h = this.getOwnerComponent().getModel("buttonsModel").getProperty("/prevPdf");
            var c = this.getOwnerComponent().getModel("OriginalPdfFiles").getProperty("/PDFFiles");
            this.overallFileSize = 0;
            for (var i = 0; i < c.length; i++) {
                this.overallFileSize = this.overallFileSize + c[i].size
            }
            if (v > .01) {
                this.overallFileSize = this.overallFileSize + v
            }
           // if (h === true) {
               // if (u) {
                  //  u = parseFloat(u);
                    //this.overallFileSize = this.overallFileSize + u
               // }
          //  }
            this.overallFileSize = this.overallFileSize.toPrecision(3);
            this.getView().byId("rFilesize").setText(this.overallFileSize + " MB ");
			this.getView().byId("panel2").setHeaderText("Bill Items (" + a + ")");
			this.getView().byId("rTotalAmt").setText("Rs." + n);
			this.getView().byId("Advancetype").setText(this.formatType(type));
		},
		formatType:function(e)
		{
				if (e === "AD") return "Advance";
			else if (e === "CA") return "Claim against Advance";
			else if (e === "CL") return "Claim"
		},
			onSaveDraft: function () {
				
				 var eSize= this.overallFileSize;
			  eSize=parseFloat(eSize);
			
            if (eSize > 5) {
                mess.error("Claim cannot be submitted as file size exceeds 5 MB");
                return
            }
			sap.ui.core.BusyIndicator.show(0);
			var l = [];
			var y = {
				Type: "E"
			};
			l.push(y);
			
			var cnew = [];
			var o = [];
			var s = {};
			var r = this.getOwnerComponent().getModel("buttonsModel");
			this.overallFileSize = 0;
			var t = this.getOwnerComponent().getModel("FileReaderModel");
			 var v = t.getProperty("/size");
			 var i = t.getProperty("/dataString");
			var s = t.getProperty("/dataStringDelay");
			var c = this.getOwnerComponent().getModel("OriginalPdfFiles").getProperty("/PDFFiles");
			if(c===undefined || c.length===0)
			{
				o = [];
			}
			else{
			
			for (var j = 0; j < c.length; j++) {
				cnew.push(c[j]);
			}
			
			
			
			
			
}
			if (i) {
				var d = t.getProperty("/size");
				d = d * 1024;
				i = i.slice(28);
				var g = {
					Linum: "001",
					Fsize: d.toString(),
					Fdata: i,
					Fista: "F"
				};
				o.push(g)
			}
			if (s) {
				var d = t.getProperty("/sizeDelay");
				d = d * 1024;
				s = s.slice(28);
				var g = {
					Linum: "001",
					Fsize: d.toString(),
					Fdata: s,
					Fista: "F"
				};
				o.push(g)
			}
			// var p = this.getView().getModel("OriginalPdfFiles").getProperty("/PDFFiles");
			var p = cnew;
			var v = p.length;
			for (var u = 0; u < v; u++) {
				var h = p[u].size.toPrecision(3);
				var c = p[u].Type;
				var f="";
				if (c == "Approval") {
					 f = "F"
				} else {
					f = "F"
				}
				var g = {
					Linum: "001",
					Fsize: h.toString(),
					Fdata: p[u].PDfData,
					Fista: f
				};
				o.push(g)
			}
			
			
			var P = r.getProperty("/process");
			var m = r.getProperty("/claimId");
			var M = r.getProperty("/prevPdf");
			var b = r.getProperty("/prevAppPdf");
			var w="";
			var F="";
			if (M == false) {
				 w = "X"
			} else {
				w = ""
			}
			if (b == false) {
				 F = "X"
			} else {
				F = ""
			}
			
			
			
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
					//item["C40T3_V"] = data[i].C40T3_V;
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
			if(reqType==="AD")
			{
				var l1=e.length;
				for(var i=0;i<l1;i++)
				{
			var value=	e[i].C40T3;				
			e[i].C20T5=value;
					delete e[i].C40T3;
					
				}
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "X",
				FlagAttach: "",
					FlagAttachApp: "",
					Fsize: "",
					FlagAttachDel: "",
			//	CSTAT:"",ASREF:"",
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: e,
				TOAttach: o,
				TOMessage: l

			};
			}
			if(reqType==="CL" )
			{
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "X",
				FlagAttach: "",
					FlagAttachApp: "",
					Fsize: "",
					FlagAttachDel: "",
			//	CSTAT:"",ASREF:"",
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: e,
				TOAttach: o,
				TOMessage: l

			};
			}
			if(reqType==="CA")
			{
				var data = e;
				var len = data.length;
				
				
				for (var i = 0; i < len; i++) {

					var value= data[i].C40T3_V;
					data[i].C40T3=value;
					
					

				}
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "X",
				FlagAttach: "",
					FlagAttachApp: "",
					Fsize: "",
					FlagAttachDel: "",
				ASREF:asref,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: data,
				TOAttach: o,
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
				FlagAttach: "",
					FlagAttachApp: "",
					Fsize: "",
					FlagAttachDel: w,
			//	CSTAT:"",ASREF:"",
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: dataNew,
				TOAttach: o,
				TOMessage: l

			};
			}
			if(reqType==="CA")
			{
				
			var C = {

				REFNR: m,
				RQAMT: n.toString(),
				FLAGSD: "X",
				FlagAttach: "",
					FlagAttachApp: "",
					Fsize: "",
					FlagAttachDel: w,
				ASREF:asref,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: dataNew,
				TOAttach: o,
				TOMessage: l

			};
			}
			}
			this.finalCall(C);
		},
		finalCall: function (e) {
			var t = this.getOwnerComponent().getModel("InitialModel");
			var r = this;
			var type=e.RQTYP;
			var flagSD=e.FLAGSD;
			t.create("/CreateDocumentSet", e, {
				success: function (e) {
					sap.ui.core.BusyIndicator.hide();
					if(flagSD==="" && type==="CL")
						{
					var date=new Date();
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMdd"
			});
			var reqDate = dateFormat.format(date);
					var number=e.TOMessage.results[0].MessageV1;
				}
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
						mess.alert("Error Occured while submitting claim!", {
							title: "Error!"
						})
					} else {
						var n = e.TOMessage.results[0].Message;
						var action;
						if(flagSD==="" && type==="CL")
						{
					action=[mess.Action.OK,"Print"];
						}
						else
						{
					action=[mess.Action.OK];
						}
						mess.success(n, {
							title: "Success!",
							actions: action,
							onClose: function (e) {
								
								if(e==="OK")
								{
								r.onNavBack()
								}
								else{
										sap.ui.core.BusyIndicator.show(0);
										r.toData1.read("/GetFormSet(Refnr='"+number+"',Rqcdt='"+reqDate+"',Type='"+type+"')/$value", null, null, true, function (oData, oResponse) {
				

sap.ui.core.BusyIndicator.hide();
				//var pdfURL=oResponse.requestUri;
				var pdfURL=oResponse.requestUri;
			window.open(pdfURL, "_blank");
			r.onNavBack()
		
			
					},
				function (oError) {
						sap.ui.core.BusyIndicator.hide();
						mess.show("Error Connecting odata service to backend")
					}
					);
				}
							}
						})
					}
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide();
					if (!e.TOMessage) {
						mess.error(e.message + " :" + e.statusCode)
					} else {
						var t = e.TOMessage.results[0].Message;
						mess.error(t)
					}
				}
			})
		},
onPrint:function(){
	var r=this;
	var t = this.getOwnerComponent().getModel("detailMasterModel");
	var number=t.getData()[0].REFNR;
	var date=t.getData()[0].CDT01;
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMdd"
			});
			var reqDate = dateFormat.format(date);
	var type=t.getData()[0].RQTYP;
	sap.ui.core.BusyIndicator.show(0);
		this.toData1.read("/GetFormSet(Refnr='"+number+"',Rqcdt='"+reqDate+"',Type='"+type+"')/$value", null, null, true, function (oData, oResponse) {
				

sap.ui.core.BusyIndicator.hide();
				//var pdfURL=oResponse.requestUri;
				var pdfURL=oResponse.requestUri;
			window.open(pdfURL, "_blank");
			//r.onNavBack()
		
			
					},
				function (oError) {
						sap.ui.core.BusyIndicator.hide();
						mess.show("Error Connecting odata service to backend")
					}
					);
},
		onSubmit: function () {
		sap.ui.core.BusyIndicator.show(0);
			var l = [];
			var y = {
				Type: "E"
			};
			l.push(y);
			
			var eSize = this.overallFileSize;
			  eSize=parseFloat(eSize);
			
            if (eSize > 5) {
                mess.error("Claim cannot be submitted as file size exceeds 5 MB");
                return
            
			}
			
			var cnew = [];
			var o = [];
			var s = {};
			var r = this.getOwnerComponent().getModel("buttonsModel");
			this.overallFileSize = 0;
			var t = this.getOwnerComponent().getModel("FileReaderModel");
			 var v = t.getProperty("/size");
			 var i = t.getProperty("/dataString");
			var s = t.getProperty("/dataStringDelay");
			var c = this.getOwnerComponent().getModel("OriginalPdfFiles").getProperty("/PDFFiles");
			if(c===undefined || c.length===0)
			{
				o = [];
			}
			else{
			
			for (var j = 0; j < c.length; j++) {
				cnew.push(c[j]);
			}
			
			
			
			
			
}
			if (i) {
				var d = t.getProperty("/size");
				d = d * 1024;
				i = i.slice(28);
				var g = {
					Linum: "001",
					Fsize: d.toString(),
					Fdata: i,
					Fista: "F"
				};
				o.push(g)
			}
			if (s) {
				var d = t.getProperty("/sizeDelay");
				d = d * 1024;
				s = s.slice(28);
				var g = {
					Linum: "001",
					Fsize: d.toString(),
					Fdata: s,
					Fista: "F"
				};
				o.push(g)
			}
			// var p = this.getView().getModel("OriginalPdfFiles").getProperty("/PDFFiles");
			var p = cnew;
			var v = p.length;
			for (var u = 0; u < v; u++) {
				var h = p[u].size.toPrecision(3);
				var c = p[u].Type;
				var f="";
				if (c == "Approval") {
					 f = "F"
				} else {
					f = "F"
				}
				var g = {
					Linum: "001",
					Fsize: h.toString(),
					Fdata: p[u].PDfData,
					Fista: f
				};
				o.push(g)
			}
			
			
			var P = r.getProperty("/process");
			var m = r.getProperty("/claimId");
			var M = r.getProperty("/prevPdf");
			var b = r.getProperty("/prevAppPdf");
			var w="";
			var F="";
			if (M == false) {
				 w = "X"
			} else {
				w = ""
			}
			if (b == false) {
				 F = "X"
			} else {
				F = ""
			}
			
			
			
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
			
			if (P === "Create") {
			var m1 = "";
			var asref=this.getOwnerComponent().getModel("buttonsModel").getProperty("/asref");
			if(reqType==="AD" )
			{
				var length=e.length;
				
				for(var i=0;i<length;i++)
				{
					var value=	e[i].C40T3;				
					e[i].C20T5=value;
					delete e[i].C40T3;
				}
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
			if(reqType==="CL")
			{
				if(eSize=="0.00")
			{
			mess.error("Attachment not found");
			sap.ui.core.BusyIndicator.hide();
                return	
			}
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
				if(eSize=="0.00")
			{
			mess.error("Attachment not found");
			sap.ui.core.BusyIndicator.hide();
                return	
			}
			var data = e;
				var len = data.length;
				
				
				for (var i = 0; i < len; i++) {

					
					var value=data[i].C40T3_V;
					data[i].C40T3= value;			

				}
			var C = {

				REFNR: m1,
				RQAMT: n.toString(),
				FLAGSD: "",
				ASREF:asref,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: data,
				//TOAttach: o,
				TOMessage: l

			};
			}
		}
			if (P === "Edit") {
				var asref=this.getOwnerComponent().getModel("buttonsModel").getProperty("/asref");
			if(reqType==="AD" || reqType==="CL")
				
			{
				
					if(eSize=="0.00" && reqType==="CL")
			{
			mess.error("Attachment not found");
			sap.ui.core.BusyIndicator.hide();
                return	
			}
				
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
				if(eSize=="0.00" )
			{
			mess.error("Attachment not found");
			sap.ui.core.BusyIndicator.hide();
                return	
			}
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
			handleMessagePopoverPress: function (e) {
			v.toggle(e.getSource())
		},
			onNavBack: function () {
			var e = this.getOwnerComponent().getModel("buttonsModel");
			var e1 = this.getOwnerComponent().getModel("InitialModel");
			e1.refresh();

			this.getOwnerComponent().getRouter().navTo("initial");

		},	onNavBack1: function () {
			var e = this.getOwnerComponent().getModel("buttonsModel");
			var t = e.getProperty("/process");
			e.setProperty("/uploadClear", false);
			
				this.getOwnerComponent().getRouter().navTo("attachment");
			

		},
		onDelete:function()
		{
			sap.ui.core.BusyIndicator.show(0);
			var l = [];
			var y = {
				Type: "E"
			};
			l.push(y);
			var del=this.getOwnerComponent().getModel("deleteSet");
			var data = del.getData();
			var len = data.length;
			var reqType=data[0].RQTYP;
				
				var n=0;
				
				
				
				var dataNew = [];
				if(reqType==="AD")
				{
				for (var i = 0; i < len; i++) {

					var item = {};
					item["RQAMT"] = data[i].RQAMT;
					item["LINUM"] = data[i].LINUM;
					item["RQTYP"] = data[i].RQTYP;
					item["REFNR"] = data[i].REFNR;
					item["CSTAT"] = data[i].CSTAT;
					item["C20T5"] = data[i].C20T5;
					
					dataNew.push(item);
					var n1=data[i].RQAMT;
					s = parseFloat(n1);
				n = n + s;

				}
				}
					if(reqType==="CA")
					{
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
					//item["C40T3_V"] = data[i].C40T3_V;
					item["AMT01"] = data[i].AMT01;
					item["AMT02"] = data[i].AMT02;
					item["AMT03"] = data[i].AMT03;
					item["AMT04"] = data[i].AMT04;
					item["AMT05"] = data[i].AMT05;
					item["AMT06"] = data[i].AMT06;
					item["AMT07"] = data[i].AMT07;
					dataNew.push(item);
					var n1=data[i].RQAMT;
					s = parseFloat(n1);
				n = n + s;

				}
					}
					if(reqType==="CL")
					{
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
					
				var n1=data[i].RQAMT;
					s = parseFloat(n1);
				n = n + s;

				}
					}

				
			
				

					if(reqType==="AD")
			{
				
			var C = {

				REFNR: data[0].REFNR,
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
			if(reqType==="CL" )
			{
			var C = {

				REFNR: data[0].REFNR,
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
				
				var len = data.length;
				
				
				for (var i = 0; i < len; i++) {

					var value= data[i].C40T3_V;
					data[i].C40T3=value;
					
					

				}
			var C = {

				REFNR: data[0].REFNR,
				RQAMT: n.toString(),
				FLAGSD: "X",
				ASREF:data[0].ASREF,
				RQTYP: reqType,
				
				//Apamt: "0",
				//	FlagSd: "X",
				TOItem: dataNew,
				//TOAttach: o,
				TOMessage: l

			};
			}
			// 	var C = {

			// 	REFNR: data[len-1].REFNR,
			// 	RQAMT: data[[len-1].RQAMT,
			// 	FLAGSD:"",
			// 	CSTAT: data[len-1].CSTAT,
			// 	C20T1: data[len - 1].C20T1,
			// 	C04T1: data[len - 1].C04T1,
			// 	//Apamt: "0",
			// 	//	FlagSd: "X",
			// 	TOItem: dataNew,
			// 	//TOAttach: o,
			// 	TOMessage: l

			// }
		this.onDeleteCall(C);
		},
		onDeleteCall:function(e)
		{
			var t = this.getOwnerComponent().getModel("InitialModel");
			var r = this;
			t.create("/DeleteClaimSet", e, {
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
						mess.alert("Error Occured while deleting claim!", {
							title: "Error!"
						})
					} else {
						var n = e.TOMessage.results[0].Message;
						mess.success(n, {
							title: "Success!",
							actions: [mess.Action.OK],
							onClose: function (e) {
								r.onNavBack()
							}
						})
					}
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide();
					if (!e.TOMessage) {
						mess.error(e.message + " :" + e.statusCode)
					} else {
						var t = e.TOMessage.results[0].Message;
						mess.error(t)
					}
				}
			})	
		}
		

	})
});