sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/m/MessageToast", "sap/ui/core/BusyIndicator", "sap/ui/model/json/JSONModel"], function(e, t, a, r, o) {
    "use strict";
    var i;
    var n = "";
    var s = false;
    var l = false;
    var d, g = "none";
    return e.extend("Furnishing.controller.Attachment", {
        onInit: function() {
            var e = {
                FileReaderIds: [],
                ApprovalFileReaderIds: [],
                oPDF: "",
                size: "",
                dataString: "",
                oPDFDelay: "",
                sizeDelay: "",
                dataStringDelay: ""
            };
            this.getView().setModel(new o({
                items: ["jpg", "jpeg", "JPG", "JPEG", "pdf", "png"],
                selected: ["jpg", "jpeg", "JPG", "JPEG", "pdf", "png"]
            }), "fileTypes");
            var t = this.getOwnerComponent().getModel("FileReaderModel");
            t.setData(e);
            this.getOwnerComponent().getRouter().getRoute("attachment").attachPatternMatched(this._onAttachmentMatched, this)
        },
        _onAttachmentMatched: function() {
            this.getView().getModel("appView").setProperty("/layout", "OneColumn");
            var e = this.getOwnerComponent().getModel("RouteModel");
            e.setProperty("/split", false);
            e.setProperty("/normal", true);
            var t = this.getOwnerComponent().getModel("buttonsModel");
			//t.setProperty("/viewName","attach");
			//t.setProperty("/ViewName","attach");
            var a = t.getProperty("/process");
            var r = t.getProperty("/uploadClear");
            if (r == true) {
                //this.getView().byId("delayUploadColl").removeAllItems();
                this.getView().byId("uploadColl").removeAllItems()
            }
            this.wasBillCreatedfromImage = false;
            this.wasApprovalCreatedFromImage = false;
            var o = this.getOwnerComponent().getModel("FileReaderModel");
            o.setProperty("/oPDFDelay", "");
            o.setProperty("/sizeDelay", 0);
            o.setProperty("/dataStringDelay", "");
            o.setProperty("/oPDF", "");
            o.setProperty("/size", 0);
            o.setProperty("/dataString", "");
            var i = this.getOwnerComponent().getModel("detailMasterModel");
            //var n = this.getOwnerComponent().getModel("detailMasterModel").getData().length;
            
            
            
        },
        onDisplayPDF2: function() {
						sap.ui.core.BusyIndicator.show(0);
			var e = this.getOwnerComponent().getModel("buttonsModel");
			var t = e.getProperty("/process");
			var r = e.getProperty("/claimId");
			
				var o = this.getOwnerComponent().getModel("InitialModel");
				var i = this;
				o.read("/CreateDocumentSet('" + r + "')", {
					urlParameters: {
						$expand: "TOAttach"
					},
					success: function (e) {
						i.bindPDF(e)
					},
					error: function (e) {
						sap.ui.core.BusyIndicator.hide();
						z.show("Error Connecting odata service to backend")
					}
				})
			
        },
        bindPDF: function(e) {
            var t = e.TOAttach.results.length;
            var a = this;
            for (var r = 0; r < t; r++) {
                var o = e.TOAttach.results[r].Fname.indexOf("FUR_CLAIM");
                if (o > -1) {
                    var i = e.TOAttach.results[r].Fdata;
                    var n = e.TOAttach.results[r].Fdata.length;
                    var s = n / (1024 * 1024);
                    s = s.toPrecision(3)
                }
            }
            a.loadPdfonDevice(i, s)
        },
        loadPdfonDevice: function(e, t) {
            sap.ui.core.BusyIndicator.hide();
            if (sap.ui.Device.system.phone) {
                var a = atob(e);
                var r = new Uint8Array(a.length);
                for (var o = 0; o < a.length; o++) {
                    r[o] = a.charCodeAt(o)
                }
                var i = new Blob([r.buffer], {
                    type: "application/pdf"
                });
                var n = URL.createObjectURL(i);
                jQuery.sap.addUrlWhitelist("blob");
                if (sap.ui.Device.os.android) {
                    var s = document.createElement("a");
                    s.href = n;
                    s.download = "file.pdf";
                    s.dispatchEvent(new MouseEvent("click"))
                } else {
                    window.open(n)
                }
            } else {
                if (t > 1.5) {
                    var a = atob(e);
                    var r = new Uint8Array(a.length);
                    for (var o = 0; o < a.length; o++) {
                        r[o] = a.charCodeAt(o)
                    }
                    var i = new Blob([r.buffer], {
                        type: "application/pdf"
                    });
                    var n = URL.createObjectURL(i);
                    jQuery.sap.addUrlWhitelist("blob");
                    window.open(n)
                } else {
                    var l = new sap.ui.core.HTML;
                    l.setContent("<iframe src=" + "data:application/pdf;base64," + e + " width='900' height='800'></iframe>");
                    var d = new sap.m.Button({
                        text: "Size: " + t + "MB",
                        type: "Transparent",
                        enabled: false
                    });
                    var g = new sap.m.Button({
                        text: "Close",
                        type: "Emphasized",
                        press: function() {
                            this.draggableDialog.close()
                        }.bind(this)
                    });
                    var h = this;
                    if (!this.draggableDialog) {
                        this.draggableDialog = new sap.m.Dialog({
                            title: "Preview",
                            contentWidth: "900px",
                            contentHeight: "800px",
                            draggable: true,
                            verticalScrolling: false,
                            buttons: []
                        });
                        this.getView().addDependent(this.draggableDialog)
                    } else {
                        this.draggableDialog.removeAllButtons()
                    }
                    var p = this.draggableDialog.getContent();
                    for (var o = 0; o < p.length; o++) {
                        this.draggableDialog.removeContent(o)
                    }
                    this.draggableDialog.addContent(l);
                    this.draggableDialog.addButton(d);
                    this.draggableDialog.addButton(g);
                    this.draggableDialog.open()
                }
            }
        },
        onDisplayApprovalPDF: function() {
            sap.ui.core.BusyIndicator.show(0);
            var e = this.getOwnerComponent().getModel("buttonsModel");
            var t = e.getProperty("/process");
            var r = e.getProperty("/claimId");
            if (t == "Edit" || t == "Display") {
                var o = this.getOwnerComponent().getModel("InitialModel");
                var i = this;
                o.read("/CLAIMS_DETAILSSet('" + r + "')", {
                    urlParameters: {
                        $expand: "TOAttach"
                    },
                    success: function(e) {
                        i.bindApprovalPDF(e)
                    },
                    error: function(e) {
                        sap.ui.core.BusyIndicator.hide();
                        a.show("Error Connecting odata service to backend")
                    }
                })
            }
        },
        bindApprovalPDF: function(e) {
            var t = e.TOAttach.results.length;
            var a = this;
            for (var r = 0; r < t; r++) {
                if (e.TOAttach.results[r].Fname === "Approval.PDF") {
                    var o = e.TOAttach.results[r].Fdata;
                    var i = e.TOAttach.results[r].Fdata.length;
                    var n = i / (1024 * 1024);
                    n = n.toPrecision(3)
                }
            }
            a.loadPdfonDevice(o, n)
        },
        onNavBack: function() {
            var e = this.getOwnerComponent().getModel("buttonsModel");
            var t = e.getProperty("/process");
            e.setProperty("/uploadClear", false);
            //if (t === "Create") {
                var a = "0";
                this.getOwnerComponent().getRouter().navTo("master", {
                    claimId: btoa(a)
                })
           // } else {
            //    history.go(-1)
           // }
        },
        onChange: function(e) {
            var t = e.getParameter("files");
            var a = this.getOwnerComponent().getModel("FileReaderModel").getProperty("/FileReaderIds");
            var r = e.getParameter("files").length;
            for (var o = 0; o < r; o++) {
                var i = {
                    File: [],
                    isConsider: "false"
                };
                i.File = t[o];
                a.push(i)
            }
            this.getView().getModel("FileReaderModel").setProperty("/FileReaderIds", a)
        },
        onApprovalChange: function(e) {
            var t = e.getParameter("files");
            var a = this.getOwnerComponent().getModel("FileReaderModel").getProperty("/ApprovalFileReaderIds");
            var r = e.getParameter("files").length;
            for (var o = 0; o < r; o++) {
                var i = {
                    File: [],
                    isConsider: "false"
                };
                i.File = t[o];
                a.push(i)
            }
            this.getView().getModel("FileReaderModel").setProperty("/ApprovalFileReaderIds", a)
        },
        GetOriginalPDFFileData: function(e, t, a, r, o, i) {
            var n = this;
            var s = {
                Name: "",
                PDfData: "",
                size: "",
                Type: ""
            };
            s.Name = t.name;
            s.size = t.size / (1024 * 1024);
            s.Type = e;
            var l = new FileReader;
            l.readAsDataURL(t);
            l.onload = function(t) {
                s.PDfData = l.result.slice(28);
                var d = n.getOwnerComponent().getModel("OriginalPdfFiles").getProperty("/PDFFiles");
                d.push(s);
                n.getView().getModel("OriginalPdfFiles").setProperty("/PDFFiles", d);
                if (e == "Bill") n.createPDFFromImages(a, r, o, i);
                else n.createApprovalPDFFromImages(a, r, o, i)
            };
            l.onerror = function(e) {
                sap.m.MessageToast.show("error")
            }
        },
        CheckAndCreateDelayApprovals: function() {
            var e;
              var len=this.getView().byId("uploadColl").getItems().length;
           
            this.CurrentFileReadersIDS = this.getView().getModel("FileReaderModel").getProperty("/ApprovalFileReaderIds");
            this.totalcount = this.CurrentFileReadersIDS.length;
            if (this.totalcount > 0) {
                e = new jsPDF("p", "mm", "a4", true, true);
                this.createApprovalPDFFromImages(e, 0, this.totalcount, 0)
            } else {
                    if(len!=0)
                    {

                    }
                    else
                    { 
				 
				 
                   
                              var e1 = {
                PDFFiles: []
            };
           
			this.getOwnerComponent().getModel("OriginalPdfFiles").setData(e1);
			this.getOwnerComponent().getModel("FileReaderModel").setProperty("/size",0.00);
                     }
                   
            
				
                this.getOwnerComponent().getRouter().navTo("review")
            }
        },
        createApprovalPDFFromImages: function(e, t, a, r) {
            var o = this;
			var attachS= this.getOwnerComponent().getModel("attachSet");
			 var len=this.getView().byId("uploadColl").getItems().length;
            if (t >= a) {
                if (this.wasApprovalCreatedFromImage) {
                    var i = e.output("datauristring").length / (1024 * 1024);
                    var n = i.toPrecision(3);
                    i = parseFloat(n);
                    e.deletePage(1);
                    var s = e.output("datauristring");
                    var l = this.getOwnerComponent().getModel("FileReaderModel");
                    l.setProperty("/oPDFDelay", e);
                    l.setProperty("/sizeDelay", i);
                    l.setProperty("/dataStringDelay", s)
                } else {
                    var l = this.getOwnerComponent().getModel("FileReaderModel");
                    l.setProperty("/oPDFDelay", "");
                    l.setProperty("/sizeDelay", 0);
                    l.setProperty("/dataStringDelay", "")
                }
				 if(len!=0)
                    {

                    }
                    else
                    {
			
                              var e1 = {
                PDFFiles: []
            };
           
			this.getOwnerComponent().getModel("OriginalPdfFiles").setData(e1);
			this.getOwnerComponent().getModel("FileReaderModel").setProperty("/size",0.00);
                     
                   
					}
                this.getOwnerComponent().getRouter().navTo("review");
                return
            }
            var d = this.CurrentFileReadersIDS[t].File;
            var h = d.type.toString();
            if (h.lastIndexOf("pdf") > 0) {
                this.GetOriginalPDFFileData("Approval", d, e, t + 1, a, r)
            } else {
                if (t < a) e.addPage();
                var p = new FileReader;
                var v = new Image;
                var f;
                var u;
                p.readAsDataURL(d);
                v.onload = function() {
                    EXIF.getData(this, function() {
                        o.exif = EXIF.getAllTags(this);
                        if (o.exif.Orientation === 8) {
                            f = v.height;
                            u = v.width;
                            g = "left"
                        } else if (o.exif.Orientation === 6) {
                            f = v.height;
                            u = v.width;
                            g = "right"
                        } else if (o.exif.Orientation === 1) {
                            f = v.width;
                            u = v.height
                        } else if (o.exif.Orientation === 3) {
                            f = v.width;
                            u = v.height;
                            g = "flip"
                        } else {
                            f = v.width;
                            u = v.height
                        }
                        var i = 600;
                        var n = 650;
                        if (f / i > u / n) {
                            if (f > i) {
                                u *= i / f;
                                f = i
                            }
                        } else {
                            if (u > n) {
                                f *= n / u;
                                u = n
                            }
                        }
                        var s = document.createElement("canvas");
                        s.width = f;
                        s.height = u;
                        var l = s.getContext("2d");
                        l.fillStyle = "white";
                        l.fillRect(0, 0, s.width, s.height);
                        if (g === "left") {
                            l.setTransform(0, -1, 1, 0, 0, u);
                            l.drawImage(v, 0, 0, u, f)
                        } else if (g === "right") {
                            l.setTransform(0, 1, -1, 0, f, 0);
                            l.drawImage(v, 0, 0, u, f)
                        } else if (g === "flip") {
                            l.setTransform(1, 0, 0, 1, 0, 0);
                            l.drawImage(v, 0, 0, f, u)
                        } else {
                            l.setTransform(1, 0, 0, 1, 0, 0);
                            l.drawImage(v, 0, 0, f, u)
                        }
                        var d = s.toDataURL("image/png");
                        e.addImage(d, "PNG", 10, 10, undefined, undefined, undefined, "FAST", 0);
                        r = s.height + 10;
                        o.wasApprovalCreatedFromImage = true;
                        o.createApprovalPDFFromImages(e, t + 1, a, r)
                    })
                };
                p.onload = function(e) {
                    v.src = p.result
                };
                p.onerror = function(e) {
                    sap.m.MessageToast.show("error")
                }
            }
        },
        createPDFFromImages: function(e, t, a, r) {
            var o = this;
            if (t >= a) {
                if (this.wasBillCreatedfromImage) {
                    var i = e.output("datauristring").length / (1024 * 1024);
                    var s = i.toPrecision(3);
                    i = parseFloat(s);
                    e.deletePage(1);
                    var l = e.output("datauristring");
                    var d = this.getOwnerComponent().getModel("FileReaderModel");
                    d.setProperty("/oPDF", e);
                    d.setProperty("/size", i);
                    d.setProperty("/dataString", l)
                } else {
                    var d = this.getOwnerComponent().getModel("FileReaderModel");
                    d.setProperty("/oPDF", "");
                    d.setProperty("/size", 0);
                    d.setProperty("/dataString", "")
                }
                if (n === "Review") {
                    this.CheckAndCreateDelayApprovals()
                } else {
                    var h = this.getOwnerComponent().getModel("FileReaderModel");
                    var p = this.getOwnerComponent().getModel("OriginalPdfFiles");
                    var l = h.getProperty("/dataString");
                    var v = this.getOwnerComponent().getModel("buttonsModel").getProperty("/claimId");
                    var f = this.getOwnerComponent().getModel("buttonsModel").getProperty("/process");
                    var u = [];
                    if (l) {
                        l = l.slice(28);
                        var c = {
                            
                            Fdata: l
                        };
                        u.push(c)
                    }
                    var m = this.getView().getModel("OriginalPdfFiles").getProperty("/PDFFiles");
                    var w = m.length;
                    for (var F = 0; F < w; F++) {
                        var c = {
                            
                            Fdata: m[F].PDfData
                        };
                        u.push(c)
                    }
                    var D = this.getOwnerComponent().getModel("buttonsModel");
                    var P = D.getProperty("/prevPdf");
                    var M = "";
                    var y = this;
                    if (!P) {
                        if (w > 0) {
                            M = "X"
                        } else {
                            y.loadPdfonDevice(l, i);
                            return
                        }
                    }
                    if (f === "Display") {
						//var documentY=this.getOwnerComponent().getModel("buttonsModel").getProperty("/YyDocument");
                        var C = {
                            //YyDocument: documentY,
                            
                            TOAttach: u
                        }
                    } else {
                        var C = {
                           // YyDocument: "",
                            
                            TOAttach: u
                        }
                    }
                    this.loadPreview(C);
                    return
                }
                return
            }
            var I = this.CurrentFileReadersIDS[t].File;
            var O = I.type.toString();
            if (O.lastIndexOf("pdf") > 0) {
                this.GetOriginalPDFFileData("Bill", I, e, t + 1, a, r)
            } else {
                if (t < a) e.addPage();
                var R = new FileReader;
                var b = new Image;
                var A;
                var T;
                R.readAsDataURL(I);
                b.onload = function() {
                    EXIF.getData(this, function() {
                        o.exif = EXIF.getAllTags(this);
                        if (o.exif.Orientation === 8) {
                            T = b.height;
                            A = b.width;
                            g = "left"
                        } else if (o.exif.Orientation === 6) {
                            T = b.height;
                            A = b.width;
                            g = "right"
                        } else if (o.exif.Orientation === 1) {
                            T = b.width;
                            A = b.height
                        } else if (o.exif.Orientation === 3) {
                            T = b.width;
                            A = b.height;
                            g = "flip"
                        } else {
                            T = b.width;
                            A = b.height
                        }
                        var i = 600;
                        var n = 650;
                        if (T / i > A / n) {
                            if (T > i) {
                                A *= i / T;
                                T = i
                            }
                        } else {
                            if (A > n) {
                                T *= n / A;
                                A = n
                            }
                        }
                        var s = document.createElement("canvas");
                        s.width = T;
                        s.height = A;
                        var l = s.getContext("2d");
                        l.fillStyle = "white";
                        l.fillRect(0, 0, s.width, s.height);
                        if (g === "left") {
                            l.setTransform(0, -1, 1, 0, 0, A);
                            l.drawImage(b, 0, 0, A, T)
                        } else if (g === "right") {
                            l.setTransform(0, 1, -1, 0, T, 0);
                            l.drawImage(b, 0, 0, A, T)
                        } else if (g === "flip") {
                            l.setTransform(1, 0, 0, 1, 0, 0);
                            l.drawImage(b, 0, 0, T, A)
                        } else {
                            l.setTransform(1, 0, 0, 1, 0, 0);
                            l.drawImage(b, 0, 0, T, A)
                        }
                        var d = s.toDataURL("image/png");
                        e.addImage(d, "PNG", 10, 10, undefined, undefined, undefined, "FAST", 0);
                        r = s.height + 10;
                        o.wasBillCreatedfromImage = true;
                        o.createPDFFromImages(e, t + 1, a, r)
                    })
                };
                R.onload = function(e) {
                    b.src = R.result
                };
                R.onerror = function(e) {
                    sap.m.MessageToast.show("error")
                }
            }
        },
        cleanupFileReaderIds: function() {
            var e = this.getView().getModel("FileReaderModel").getProperty("/FileReaderIds");
            var t = e.length;
            var a = this.getView().byId("uploadColl");
            var r = a.getItems().length;
            var o = [];
            for (var i = 0; i < r; i++) {
                var n = a.getItems()[i].getFileName();
                for (var s = 0; s < t; s++) {
                    if (e[s].File.name === n) {
                        if (e[s].isConsider === "false") {
                            o.push(e[s]);
                            e[s].isConsider = "true";
                            s = t + 1
                        }
                    }
                }
            }
            if (!sap.ui.Device.os.ios) o.reverse();
            if (o.length > 0) {
                for (var l = 0; l < o.length; l++) {
                    o[l].isConsider = "false"
                }
                this.getView().getModel("FileReaderModel").setProperty("/FileReaderIds", o)
            }
        },
        cleanupApprovalFileReaderIds: function() {
            var e = this.getView().getModel("FileReaderModel").getProperty("/ApprovalFileReaderIds");
            var t = e.length;
            var a = this.getView().byId("delayUploadColl");
            var r = a.getItems().length;
            var o = [];
            for (var i = 0; i < r; i++) {
                var n = a.getItems()[i].getFileName();
                for (var s = 0; s < t; s++) {
                    if (e[s].name === n) {
                        if (e[s].isConsider === "false") {
                            o.push(e[s]);
                            e[s].isConsider = "true";
                            s = t + 1
                        }
                    }
                }
            }
            if (!sap.ui.Device.os.ios) o.reverse();
            if (o.length > 0) {
                for (var l = 0; l < o.length; l++) {
                    o[l].isConsider = "false"
                }
                this.getView().getModel("FileReaderModel").setProperty("/ApprovalFileReaderIds", o)
            }
        },
        onReview: function() {
            var e = {
                PDFFiles: []
            };
            var t = this.getOwnerComponent().getModel("OriginalPdfFiles");
            t.setData(e);
            n = "Review";
            var a = this.getView().byId("uploadColl").getItems().length;
            sap.ui.core.BusyIndicator.show(0);
            this.cleanupFileReaderIds();
            //this.cleanupApprovalFileReaderIds();
            this.CurrentFileReadersIDS = this.getView().getModel("FileReaderModel").getProperty("/FileReaderIds");
            this.totalcount = this.CurrentFileReadersIDS.length;
            if (this.totalcount > 0) {
                var r = new jsPDF("p", "mm", "a4", true, true)
            }
            this.createPDFFromImages(r, 0, this.totalcount, 0)
        },
        onDeleteApprovalPDF: function() {
            var e = this.getOwnerComponent().getModel("buttonsModel");
            var t = e.setProperty("/prevAppPdf", false)
        },
        onDeletePDF2: function() {
            var e = this.getOwnerComponent().getModel("buttonsModel");
            var t = e.setProperty("/prevPdf", false);
			
			
        },
        onPreview: function() {
            var e = {
                PDFFiles: []
            };
            var a = this.getOwnerComponent().getModel("OriginalPdfFiles");
            a.setData(e);
            n = "Preview";
            var r = this.getView().byId("uploadColl").getItems().length;
            if (r > 0) {
                sap.ui.core.BusyIndicator.show(0);
                this.cleanupFileReaderIds();
                this.CurrentFileReadersIDS = this.getView().getModel("FileReaderModel").getProperty("/FileReaderIds");
                this.totalcount = this.CurrentFileReadersIDS.length;
                if (this.totalcount > 0) {
                    var o = new jsPDF("p", "mm", "a4", true, true)
                }
                this.createPDFFromImages(o, 0, this.totalcount, 0)
            } else {
                t.error("Please add a file to Preview")
            }
        },
        loadPreview: function(e) {
            var a = this.getOwnerComponent().getModel("InitialModel");
            var r = this;
            a.create("/Attach_mergeSet", e, {
                success: function(e) {
                    sap.ui.core.BusyIndicator.hide();
                    r.bindPDF(e)
                },
                error: function(e) {
                    sap.ui.core.BusyIndicator.hide();
                    t.error("Error while calling oData Service")
                }
            })
        },
        onBeforeRendering: function() {
          //  var e = this.byId("delayUploadColl").getItems();
            var t = this.byId("uploadColl").getItems()
        },
        onBeforeUploadStarts: function(e) {
            var t = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: e.getParameter("fileName")
            });
            e.getParameters().addHeaderParameter(t);
            e.getParameters().addHeaderParameter(i)
        },
        onUploadComplete: function(e) {
            var t = this
        },
        onFileSizeExceed: function(e) {
            a.show("File Size Exceeded")
        },
        onTypeMissmatch: function(e) {
            t.show("This File Type is not supported!!")
        },
        onTypeMissmatchD: function(e) {
            t.show("This File Type is not supported!!")
        },
        onFilenameLengthExceed: function(e) {
            a.show("Long File Path/Name not supported!!")
        },
        onFileDeleted: function(e) {
            var t = e.getSource();
            a.show("File Deleted")
        },
        deletePress: function(e) {
            var t = e.getSource()
        },
        onFileDeletedD: function(e) {
            var t = e.getSource();
            a.show("File Deleted")
        }
    })
});