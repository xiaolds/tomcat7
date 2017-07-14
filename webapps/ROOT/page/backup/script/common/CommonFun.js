function ClassDevice(){
	
		this.ShowPro = function(){
					var c = $('.processingbar');
					animateEle();
					$(window).scroll(function() {
								animateEle();
							});

					function animateEle() {
						var b = {
							top : $(window).scrollTop(),
							bottom : $(window).scrollTop() + $(window).height()
						};
						c.each(function() {
									if (b.top <= $(this).offset().top
											&& b.bottom >= $(this).offset().top
											&& !$(this).data('bPlay')) {
										$(this).data('bPlay', true);
										var a = $(this).parent().find('font')
												.text().replace(/\%/, '');
										if ($(this).find("font").text() !== "0%") {
											$(this).svgCircle({
												parent : $(this)[0],
												w : 100,
												R : 46,
												sW : 7,
												color : ["#f1dab0", "#848400",
														"#f1dab0"],
												perent : [100, a],
												speed : 150,
												delay : 400
											});
										}
										if ($(this).find("font").text() == "0%") {
											$(this).find("font").css("color",
													"#a9a9a9");
											$(this).svgCircle({
												parent : $(this)[0],
												w : 100,
												R : 46,
												sW : 7,
												color : ["#d1d1d1", "#d1d1d1",
														"#d1d1d1"],
												perent : [100, a],
												speed : 150,
												delay : 500
											});
										}
									}
								});
					}
				
		};
		
		this.showFieldSetDevice = function(){
//        		 var grform = Ext.getCmp("aboutPanel");
//        		 grform.removeAll();
//				 var ylength = 70;
				 Ext.Ajax.request({
							  url: '/backup/todeviceAction!getDevicesTree_fileSet.action',
							  success: function (response) {
							  	var obj = eval("(" + response.responseText + ")").children;
							  	var cou = 0;
							  	 var inner= "";
							   	for(var i = 0;i < obj.length;i++){
							   		if("createGroup" != obj[i].id){
							   			if(obj[i].children.length>0){
							   				inner+="<fieldset id='fieldset"+obj[i].id+"' class='device_view'>"+
								                        "<legend>" +
								                        	"<i class='icon_arrow'></i>" +
								                        	"<span class='legend_text'>"+obj[i].text+"</span>" +
								                        "</legend><ul class='field_cont'>";
								                        cou = cou+obj[i].children.length;
								                         for(var m = 0 ;m<obj[i].children.length; m++){
							                         	 	 var deviceId = obj[i].children[m].deviceId;//设备Id
									            			 var status = obj[i].children[m].status;//设备状态 1：在线2：不在线 3：异常
									            			 var clientSysType = obj[i].children[m].clientSystype;//0:window 1:Linux
									            			 var standby = obj[i].children[m].standby;//设备是否双机  1:是双机 2：非双击
									            			 var homePageIco = obj[i].children[m].homePageIco;
									            			 
									            			 //通过后台获取备份状态、性能监控、业务监控
									            			 inner += //"<ul class='field_cont'>"+licenseFlag
											                        	"<li class='field_cont_li'>"+
													                        "<a class='field_cont_a clear' onClick=\"clickEvent_fieldset('"+obj[i].children[m].id+"','"+obj[i].children[m].ip+"','"
													                        															 +obj[i].children[m].status+"','"+obj[i].children[m].pageText+"','"
													                        															 +obj[i].children[m].sysVersion+"','"+obj[i].children[m].clientVersion+"','"
													                        															 +obj[i].children[m].standby+"','"+obj[i].children[m].deviceMac+"','"
													                        															 +obj[i].children[m].clientSystype+"','"+obj[i].children[m].id+"','"
													                        															 +obj[i].children[m].deviceType+"','"+obj[i].children[m].pageIco+"','"
													                        															 +obj[i].children[m].uuid+"','"+obj[i].children[m].licenseWarning+"','"
													                        															 +obj[i].children[m].licenseWarningSystem+"','" +obj[i].children[m].clusterIdentity+"','"
													                        															 +obj[i].children[m].licenseWarningDB+"','"+obj[i].children[m].licenseWarningUrl+"','"
													                        															 +obj[i].children[m].licenseWarningScript+"','"+obj[i].children[m].licenseFlag+"')\">"+
														                        "<div class='field_li_left'>";
														                        if(2 == status){//不在线
														                        	inner +=  
														                        		"<div class='circle_left'><img src='images/backup/gray_1.png' width='80' height='80'></div>"+
															                        	"<div class='circle_right'><img src='images/backup/gray_2.png' width='80' height='80'></div>"+
															                        	"<div class='circle_bottom'><img src='images/backup/gray_3.png' width='80' height='80'></div>";
														                        }else{//在线
														                        	var cha = obj[i].children[m].monit;
																					var ch = cha.split("-");
																					if("1"==ch[0]){
																						inner += "<div class='circle_left'><img src='images/backup/blue_1.png' width='80' height='80'></div>"
																					}else if("2"==ch[0]){
																						inner += "<div class='circle_left'><img src='images/backup/gray_1.png' width='80' height='80'></div>"
																					}else{
																						inner += "<div class='circle_left'><img src='images/backup/orange_1.png' width='80' height='80'></div>"
																					}
																					
																					if("1"==ch[1]){
																						inner += "<div class='circle_right'><img src='images/backup/blue_2.png' width='80' height='80'></div>";
																					}else if("2"==ch[1]){
																						inner += "<div class='circle_right'><img src='images/backup/gray_2.png' width='80' height='80'></div>";
																					}else{
																						inner += "<div class='circle_right'><img src='images/backup/orange_2.png' width='80' height='80'></div>";
																					}
																					
																					if("1"==ch[2]){
																						inner += "<div class='circle_bottom'><img src='images/backup/blue_3.png' width='80' height='80'></div>";
																					}else if("2"==ch[2]){
																						inner += "<div class='circle_bottom'><img src='images/backup/gray_3.png' width='80' height='80'></div>";
																					}else{
																						inner += "<div class='circle_bottom'><img src='images/backup/orange_3.png' width='80' height='80'></div>";
																					}
														                        }
															                       inner += "<div class='circle_middle'><img src='images/backup/"+homePageIco+"' width='80' height='80'></div>"+
													                        	"</div>"+
													                        	"<div class='field_li_right'>"+
														                        	"<span class='font_h4'>"+obj[i].children[m].pageText+"</span>"+
														                        	"<span class='field_title_info'>"+ obj[i].children[m].ip+"</span>"+
														                        "</div>"+
													                        "</a>"+
												                        "</li>";
										                        	//"</ul>";
							   			}
							   			 inner +="</ul></fieldset>";
							   		}
							   	}
							  	 Ext.getCmp("aboutPanel").body.update(inner);  
							  	
							   /*var obj = eval("(" + response.responseText + ")").children;
							   var cou = 0;
							   for(var i = 0;i < obj.length;i++){
							   		if("createGroup" != obj[i].id){
							   			if(obj[i].children.length>0){
									   		grform.add({
										 			xtype : 'fieldset',
										 			id : 'fieldset'+obj[i].id,
													title :obj[i].text,
													border : "1 0 0 0",
													collapsible : true, 
													margin:20,
													defaults : {
														anchor : '100%'
													},
													items : [{
										    					xtype : 'panel',
										    					id : 'panel'+obj[i].id,
										    					name : 'panel'+obj[i].id,
										    					width : '100%',
										    					height : '100%',
										    					layout : 'column',
										    					columns : 2,
										    					border : false
										    					
										    				}]
										 	});
							   			}
							   		}
							   }
							   for(var k = 0 ;k<obj.length; k++){
								   var pannelgroup = Ext.getCmp("panel"+obj[k].id+"");
									if("createGroup" != obj[k].id){
										 	cou = cou+obj[k].children.length;
										   for(var m = 0 ;m<obj[k].children.length; m++){
										   	var pan = new Ext.panel.Panel({ 
													             id :'sonPanel'+obj[k].children[m].id,
																 width : '100%',
																 border : false,
																 layout: {
																	        type: 'table',
																	        // 列数
																	        columns: 2
																	     },
														         defaults: {
														       		width:220,
														       		style:'cursor:pointer'
																  }, 
															     listeners: {
															     		afterrender : function(){
															     			var deId = obj[k].children[m].id.split("-")[0];
																  			var deIp = obj[k].children[m].ip;
																  			var deStatus = obj[k].children[m].status;
																  			var deText = obj[k].children[m].pageText;//text
																  			var deSysVer =obj[k].children[m].sysVersion;
																  			var deCliVersion = obj[k].children[m].clientVersion;
																  			var deIsStandby = obj[k].children[m].standby;
																  			var deviceMac = obj[k].children[m].deviceMac;
																  			var deSysType = obj[k].children[m].clientSystype;
																  			var sonId = obj[k].children[m].id;
																  			var deviceType = obj[k].children[m].deviceType;
																  			var deviceIco = obj[k].children[m].pageIco;
																  			var deuuid = obj[k].children[m].uuid;
																			 
																		Ext.getCmp("sonPanel"+sonId).getEl().on('click',function(){
															     			
																			 var contentPanel = Ext.getCmp('contentPanel');
																			  			contentPanel.removeAll();
																			  			contentPanel.add({
																			  				xtype : 'DeviceBackup',
																							itemId : 'BackupMonitorsPanel',
																							deId : deId,
																							deText:deText,
																							deIp : deIp,
																							deSysVer : deSysVer,
																							deCliVersion :deCliVersion,
																							deIsStandby : deIsStandby,
																							deStatus : deStatus,
																							deMac:deviceMac,
																							deviceType:deviceType,
																							deviceIco:deviceIco,
																							deuuid : deuuid
																			  			});
																			  		contentPanel.doLayout();
																				})
																     		},
																     		//渲染后添加事件
														            		render : function() {}
														            		},
																 items :[{
																        id : 'gson'+obj[k].children[m].id,
																        bodyStyle: 'padding:14px 8px 0 12px',
																        border : false,
																        width:100,
																        height:100,
																        rowspan: 2,  //占用两行
																        html: "<div style='position:relative;width:80px;height:80px;'>" +
																	        	  "<div id='bf"+obj[k].children[m].deviceId+"' style='position:absolute;left:0; top:0; width: 80px; height: 80px;'><img src='/images/backup/blue_1.png' width=80 height=80></div>" +
																	        	  "<div id='xn"+obj[k].children[m].deviceId+"' style='position:absolute;left:0; top:0; width: 80px; height: 80px;'><img src='/images/backup/blue_2.png' width=80 height=80></div>" +
																	        	  "<div id='yw"+obj[k].children[m].deviceId+"' style='position:absolute;left:0; top:0; width: 80px; height: 80px;'><img src='/images/backup/blue_3.png' width=80 height=80></div>" +
																	        	  "<div id='sb"+obj[k].children[m].deviceId+"' style='position:absolute;left:0; top:0; width: 80px; height: 80px;'></div>"+
																        	  "</div>",
															            listeners: {
															            		afterrender : function() {
															            			
															            			 var sonPanel=this;
															            			 var deviceId = obj[k].children[m].deviceId;//设备Id
															            			 var status = obj[k].children[m].status;//设备状态 1：在线2：不在线 3：异常
															            			 var clientSysType = obj[k].children[m].clientSystype;//0:window 1:Linux
															            			 var standby = obj[k].children[m].standby;//设备是否双机  1:是双机 2：非双击
															            			 var homePageIco = obj[k].children[m].homePageIco;
															            			 //通过后台获取备份状态、性能监控、业务监控
															            			 
															            			 document.getElementById("sb"+deviceId).innerHTML="<img src='/images/backup/"+homePageIco+"' width=80 height=80>";
															            			 
															            			 if(2 == status){//不在线
															            			 	document.getElementById("bf"+deviceId).innerHTML="<img src='/images/backup/gray_1.png' width=80 height=80>";
														            			 		document.getElementById("xn"+deviceId).innerHTML="<img src='/images/backup/gray_2.png' width=80 height=80>";
														            			 		document.getElementById("yw"+deviceId).innerHTML="<img src='/images/backup/gray_3.png' width=80 height=80>";
															            			 }else{//在线
															            			 	var cha = obj[k].children[m].monit;
																						var ch = cha.split("-");
																						if("1"==ch[0]){
																							document.getElementById("bf"+deviceId).innerHTML="<img src='/images/backup/blue_1.png' width=80 height=80>";
																						}else if("2"==ch[0]){
																							document.getElementById("bf"+deviceId).innerHTML="<img src='/images/backup/gray_1.png' width=80 height=80>";
																						}else{
																							document.getElementById("bf"+deviceId).innerHTML="<img src='/images/backup/orange_1.png' width=80 height=80>";
																						}
																						if("1"==ch[1]){
																							document.getElementById("xn"+deviceId).innerHTML="<img src='/images/backup/blue_2.png' width=80 height=80>";
																						}else if("2"==ch[1]){
																							document.getElementById("xn"+deviceId).innerHTML="<img src='/images/backup/gray_2.png' width=80 height=80>";
																						}else{
																							document.getElementById("xn"+deviceId).innerHTML="<img src='/images/backup/orange_2.png' width=80 height=80>";
																						}
																						
																						if("1"==ch[2]){
																							document.getElementById("yw"+deviceId).innerHTML="<img src='/images/backup/blue_3.png' width=80 height=80>";
																						}else if("2"==ch[2]){
																							document.getElementById("yw"+deviceId).innerHTML="<img src='/images/backup/gray_3.png' width=80 height=80>";
																						}else{
																							document.getElementById("yw"+deviceId).innerHTML="<img src='/images/backup/orange_3.png' width=80 height=80>";
																						}
															            			 	Ext.Ajax.request({
																							url : '/backup/todeviceAction!getInfoForHome.action',
																							params : {
																								deviceId : deviceId
																							},
																							success : function(response, options) {
																								var obje=Ext.decode(response.responseText);
																								var cha = obje.info;
																								var ch = cha.split("-");
																								if("1"==ch[0]){
																									document.getElementById("bf"+deviceId).innerHTML="<img src='/images/backup/blue_1.png' width=80 height=80>";
																								}else if("2"==ch[0]){
																									document.getElementById("bf"+deviceId).innerHTML="<img src='/images/backup/gray_1.png' width=80 height=80>";
																								}else{
																									document.getElementById("bf"+deviceId).innerHTML="<img src='/images/backup/orange_1.png' width=80 height=80>";
																								}
																								if("1"==ch[1]){
																									document.getElementById("xn"+deviceId).innerHTML="<img src='/images/backup/blue_2.png' width=80 height=80>";
																								}else if("2"==ch[1]){
																									document.getElementById("xn"+deviceId).innerHTML="<img src='/images/backup/gray_2.png' width=80 height=80>";
																								}else{
																									document.getElementById("xn"+deviceId).innerHTML="<img src='/images/backup/orange_2.png' width=80 height=80>";
																								}
																								
																								if("1"==ch[2]){
																									document.getElementById("yw"+deviceId).innerHTML="<img src='/images/backup/blue_3.png' width=80 height=80>";
																								}else if("2"==ch[2]){
																									document.getElementById("yw"+deviceId).innerHTML="<img src='/images/backup/gray_3.png' width=80 height=80>";
																								}else{
																									document.getElementById("yw"+deviceId).innerHTML="<img src='/images/backup/orange_3.png' width=80 height=80>";
																								}
																							}
																							
																						})
															            			 }
															            			}
															            		}
																    },{
															            id:'sername'+obj[k].children[m].id,
															            border : false,
															            bodyStyle: 'padding-top:18px',
															            html : '<font class="font_h4">'+obj[k].children[m].pageText+'</font>',
															            height:40
														       	 	},{
															            id:'serip'+obj[k].children[m].id,
															            border : false,
															            html : obj[k].children[m].ip,
															            height:40
															            
														        }]
													      });
												pannelgroup.add(pan);
										   }
									   }
							   }*/
							   	 Ext.getCmp('deviceCount').update("<div><img style='float:left;' src='/images/backup/backup.png'></img><div style='float:left;margin-left:15px;'><font class='font_h3'>"+local.backup.title+"</font><br>"+cou+local.backup.title2+"</div></div>");
							     Ext.getCmp('BackupView').doLayout(); 
							     
							     Ext.getCmp("refrush").setDisabled(false);
							  }
						}
				 });
	};
	
			this.showClusterDevice = function(clusterId){
				 Ext.Ajax.request({
							  url: '/backup/todeviceAction!getClusterDevices.action',
							  params : {
	                    			clusterId : clusterId
	                        	},
							  success: function (response) {
							  	var obj = eval("(" + response.responseText + ")").children;
							  	var cou = 0;
							  	var clusterName = "";
							  	 var inner= "";
							   	for(var i = 0;i < obj.length;i++){
								                        cou = cou+obj[i].children.length;
								                        clusterName = obj[i].groupName_pageshow;
								                         for(var m = 0 ;m<obj[i].children.length; m++){
							                         	 	 var deviceId = obj[i].children[m].deviceId;//设备Id
									            			 var status = obj[i].children[m].status;//设备状态 1：在线2：不在线 3：异常
									            			 var clientSysType = obj[i].children[m].clientSystype;//0:window 1:Linux
									            			 var standby = obj[i].children[m].standby;//设备是否双机  1:是双机 2：非双击
									            			 var homePageIco = obj[i].children[m].homePageIco;
									            			 
									            			 //通过后台获取备份状态、性能监控、业务监控
									            			 inner += //"<ul class='field_cont'>"+licenseFlag
											                        	"<li class='field_cont_li'>"+
													                        "<a class='field_cont_a clear' onClick=\"clickEvent_fieldset('"+obj[i].children[m].id+"','"+obj[i].children[m].ip+"','"
													                        															 +obj[i].children[m].status+"','"+obj[i].children[m].pageText+"','"
													                        															 +obj[i].children[m].sysVersion+"','"+obj[i].children[m].clientVersion+"','"
													                        															 +obj[i].children[m].standby+"','"+obj[i].children[m].deviceMac+"','"
													                        															 +obj[i].children[m].clientSystype+"','"+obj[i].children[m].id+"','"
													                        															 +obj[i].children[m].deviceType+"','"+obj[i].children[m].pageIco+"','"
													                        															 +obj[i].children[m].uuid+"','"+obj[i].children[m].licenseWarning+"','"
													                        															 +obj[i].children[m].licenseWarningSystem+"','" +obj[i].children[m].clusterIdentity+"','"
													                        															 +obj[i].children[m].licenseWarningDB+"','"+obj[i].children[m].licenseWarningUrl+"','"
													                        															 +obj[i].children[m].licenseWarningScript+"','"+obj[i].children[m].licenseFlag+"')\">"+
														                        "<div class='field_li_left'>";
														                        if(2 == status){//不在线
														                        	inner +=  
														                        		"<div class='circle_left'><img src='images/backup/gray_1.png' width='80' height='80'></div>"+
															                        	"<div class='circle_right'><img src='images/backup/gray_2.png' width='80' height='80'></div>"+
															                        	"<div class='circle_bottom'><img src='images/backup/gray_3.png' width='80' height='80'></div>";
														                        }else{//在线
														                        	var cha = obj[i].children[m].monit;
																					var ch = cha.split("-");
																					if("1"==ch[0]){
																						inner += "<div class='circle_left'><img src='images/backup/blue_1.png' width='80' height='80'></div>"
																					}else if("2"==ch[0]){
																						inner += "<div class='circle_left'><img src='images/backup/gray_1.png' width='80' height='80'></div>"
																					}else{
																						inner += "<div class='circle_left'><img src='images/backup/orange_1.png' width='80' height='80'></div>"
																					}
																					
																					if("1"==ch[1]){
																						inner += "<div class='circle_right'><img src='images/backup/blue_2.png' width='80' height='80'></div>";
																					}else if("2"==ch[1]){
																						inner += "<div class='circle_right'><img src='images/backup/gray_2.png' width='80' height='80'></div>";
																					}else{
																						inner += "<div class='circle_right'><img src='images/backup/orange_2.png' width='80' height='80'></div>";
																					}
																					
																					if("1"==ch[2]){
																						inner += "<div class='circle_bottom'><img src='images/backup/blue_3.png' width='80' height='80'></div>";
																					}else if("2"==ch[2]){
																						inner += "<div class='circle_bottom'><img src='images/backup/gray_3.png' width='80' height='80'></div>";
																					}else{
																						inner += "<div class='circle_bottom'><img src='images/backup/orange_3.png' width='80' height='80'></div>";
																					}
														                        }
															                       inner += "<div class='circle_middle'><img src='images/backup/"+homePageIco+"' width='80' height='80'></div>"+
													                        	"</div>"+
													                        	"<div class='field_li_right'>"+
														                        	"<span class='font_h4'>"+obj[i].children[m].pageText+"</span>"+
														                        	"<span class='field_title_info'>"+ obj[i].children[m].ip+"</span>"+
														                        "</div>"+
													                        "</a>"+
												                        "</li>";
										                        	//"</ul>";
							   			}
							   			 inner +="</ul></fieldset>";
							  	 Ext.getCmp("aboutPanel").body.update(inner);  
							   	 Ext.getCmp('clusterDeviceCount').update("<div><img style='float:left;' src='/images/backup/backup.png'></img><div style='float:left;margin-left:15px;'><font class='font_h3'>"+clusterName+"</font><br>"+cou+local.backup.title2+"</div></div>");
							     Ext.getCmp('clusterView').doLayout(); 
							     
							     Ext.getCmp("clusterRefrush").setDisabled(false);
							  }
						}
				 });
	}
}

function clickEvent_fieldset(deId_,deIp_,deStatus_,deText_,deSysVer_,deCliVersion_,deIsStandby_,deviceMac_,deSysType_,sonId_,deviceType_,deviceIco_,deuuid_,licenseWarning_,licenseWarningSystem_,clusterIdentity_,licenseWarningDB_,licenseWarningUrl_,licenseWarningScript_,licenseFlag_){
	if(2 == licenseFlag_){
		Ext.MessageBox.alert(local.window.tip, local.unauthDevNoOperate);
		return;
	}
	var deId = deId_.split("-")[0];
	var deIp = deIp_;
	var deStatus = deStatus_;
	var deText = deText_;//text
	var deSysVer = deSysVer_;
	var deCliVersion = deCliVersion_;
	var deIsStandby = deIsStandby_;
	var deviceMac = deviceMac_;
	var deSysType = deSysType_;
	var sonId = sonId_;
	var deviceType = deviceType_;
	var deviceIco = deviceIco_;
	var deuuid = deuuid_;
	var licenseWarning = licenseWarning_;
	var isClusterDevice = clusterIdentity_;
	var licenseWarningSystem = licenseWarningSystem_;
	var licenseWarningDB = licenseWarningDB_;
	var licenseWarningUrl = licenseWarningUrl_;
	var licenseWarningScript = licenseWarningScript_;
	 
	var contentPanel = Ext.getCmp('contentPanel');
	
	contentPanel.removeAll();
	contentPanel.add({
		xtype : 'DeviceBackup',
		itemId : 'BackupMonitorsPanel',
		deId : deId,
		deText:deText,
		deIp : deIp,
		deSysVer : deSysVer,
		deCliVersion :deCliVersion,
		deClientSystype:deSysType,
		deIsStandby : deIsStandby,
		deStatus : deStatus,
		deMac:deviceMac,
		deviceType:deviceType,
		deviceIco:deviceIco,
		isClusterDevice:isClusterDevice,
		deuuid : deuuid,
		licenseWarning : licenseWarning,
		licenseWarningSystem : licenseWarningSystem,
		licenseWarningDB : licenseWarningDB,
		licenseWarningUrl : licenseWarningUrl,
		licenseWarningScript : licenseWarningScript
	});
contentPanel.doLayout();
}