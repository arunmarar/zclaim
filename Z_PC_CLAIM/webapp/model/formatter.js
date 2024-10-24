sap.ui.define([], function () {
	"use strict";
	return {
		currencyValue: function (e) {
			if (!e) {
				return ""
			}
			return parseFloat(e).toFixed(2)
		},
		formatTaxType: function (e) {
			if (!e) {
				return "No"
			}
			if (e === "No") {
				return "No"
			} else return "Yes"
		},
			formatAdvanceType:function(e)
		{
				if (e === "AD") return "Advance";
			else if (e === "CA") return "Claim against Advance";
			else if (e === "CL") return "Claim"
		},
		formatCityType: function (e) {
			if (!e) {
				return "No"
			}
			if (e === "N") return "Not Applicable";
			else return e
		},
		formatOutStatioin: function (e) {
			if (e === "1") return "Yes";
			else if (e === "2") return "No";
			else if (e === "3") return "Not Applicable"
		},
		
		
		
		statusText: function (e, r) {
			if (e == "N" ) {
				var t = "New";
				return t
			
			} else if (e == "T") {
				var t = "To be Approved";
				return t
			} else if (e == "P") {
				var t = "Partially Approved";
				return t
			} else if (e == "A") {
				var t = "Approved";
				return t
			} else if (e == "R") {
				var t = "Rejected";
				return t
			} else if (e == "D") {
				var t = "Processing Complete";
				return t
			} else if (e == "X") {
				var t = "Deleted";
				return t
			} else if (e == "B") {
				var t = "To Be Processed";
				return t
			} else if (e == "C") {
				var t = "Closed";
				return t
			} else if (e == "K") {
				var t = "Cancelled";
				return t
			} else if (e == "S") {
				var t = "Settled";
				return t
			}
		},
		formatStatus: function (e, r) {
			if (e === "A") {
				var t = "Success";
				return t
			} else if (e === "R") {
				t = "Error";
				return t
			} else if (e === "T") {
				t = "Warning";
				return t
			} else if (e === "N" & r === "X") {
				var n = "Error";
				return n
			} else {
				t = "None";
				return t
			}
		},
		formatItemType: function (e) {
			switch (e) {
			case "CON":
				return "Consultation";
				break;
			case "MED":
				return "Medicines";
				break;
			case "TST":
				return "Tests";
				break;
			case "HOS":
				return "Hospitalization";
				break;
			case "TRV":
				return "Travel Expenses";
				break;
			case "OTH":
				return "Others";
				break
			}
		},
		formatReqDate: function (e) {
			if (typeof e === "undefined" || e === null) {
				return
			} else if (e !== "") {
				var r = e.toDateString().slice(4);
				return r
			}
		}
	}
});