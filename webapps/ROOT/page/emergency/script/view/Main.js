Ext.Loader.setConfig({
			enabled : true
		});
Ext.application({
	name : "acesure.emergency",
	appFolder : '/page/emergency/script',
	controllers: [
	              'EmergencyController'
	],
	// 当前页面加载完成执行的函数
	launch : function() {
		// 页面加载完成之后执行
		Ext.create("acesure.emergency.view.mainPanel");
		
	}
});

/**
 * 应急接管模块主框架
 */
Ext.define('acesure.emergency.view.mainPanel', {
			extend : 'Ext.container.Viewport',
			layout : 'border',
			border : false,
			minWidth:1024,
			initComponent : function() {
				var me = this;
				me.items = [ {
	            	xtype:'GlobalMenu',
	            	region : 'north',
	            	border:false,
	            	height:60
	            },{
					xtype : 'grobleTreePanel',
				   	region : 'west',
				   	floating : false,
				   	width : 239,
				   	bodyStyle:'background:#f5f8fa;',
				   	listeners : {
				   		itemclick:function(record, item, index, e, eOpts ){
				   			var ids = item.data.id ;
				   			if("createGroup" == ids){
//				   				alert("createGroup");
				   			}else if(null == item.data.children){
				   				//alert(JSON.stringify(item.raw));
				   				var licenseFlag_ = item.raw.licenseFlag;
				   				var licenseEmergency=item.raw.licenseEmergency;
				   				if(2 == licenseFlag_){
				   					Ext.MessageBox.alert(local.window.tip, local.unauthDevNoOperate);
				   					return;
				   				}
				   				var contentPanel = Ext.getCmp('contentPanel');
				   				contentPanel.removeAll();
				   				var takeOver = Ext.create("acesure.emergency.view.TakeOver",{
				   					clusterIdentity : item.raw.clusterIdentity,
				   					deviceId : item.raw.deviceId,
				   					deviceName : item.raw.pageText,
				   					deviceIp : item.raw.ip,
				   					uuid : item.raw.uuid,
				   					sysInfo : item.raw.sysInfo,
				   					version : item.raw.version,
				   					type : item.raw.type,
				   					ip:item.raw.ip,
				   					authorizeEmergency:licenseEmergency,
				   					deviceState:item.raw.status,
				   					deviceType:item.raw.deviceType
				   				});
				   				contentPanel.add( takeOver );
				   				contentPanel.doLayout();
				   			}else if(null != item.data.children&& item.raw.groupType != 0){
//				   				groupType":2,
//				   	            "id":"36-g",
//				   	            "icon":"",
//				   	            "deviceCount":3,
//				   	            "text":"[集群]jiqun[3/3]",
//				   	            "groupName":"jiqun",
//				   	            "cls":"font_bold",
//				   	            "children":[
				   				//alert(JSON.stringify(item.raw));
				   				//集群item点击事件
				   				var contentPanel = Ext.getCmp('contentPanel');
				   				contentPanel.removeAll();
				   				 var clusterVmimgView = Ext.create("acesure.emergency.view.ClusterVmimgView",{
					   					deviceId : item.raw.id,
					   					deviceName : item.raw.groupName,
					   					deviceIp : item.raw.ip,
					   					uuid : item.raw.uuid,
					   					sysInfo : item.raw.sysInfo,
					   					version : item.raw.version,
					   					type : item.raw.type,
					   					ip : item.raw.deviceCount,
					   					//waring:TODO 消息服务器授权
					   					authorizeEmergency:1,
					   					deviceState:item.raw.status,
					   					deviceType:item.raw.deviceType
					   				});
					   				contentPanel.add( clusterVmimgView );
					   				contentPanel.doLayout();
					  		}
				   		},
						'itemcontextmenu' : function(menutree, record, items, index, e) {  
							e.preventDefault();
							var licenseFlagFirst = record.raw.licenseFlag;
							if(2 == licenseFlagFirst){
								Ext.MessageBox.alert(local.window.tip, local.unauthDevNoOperate);
								return;
							}
							var nodemenu = new Ext.menu.Menu({
								floating : true,  
								items : []  
							});
							if(record.data.id.split("-")[1]=="d"){
								nodemenu.add([{  
									text : local.emergency.quickOver,   
									icon:"/images/emergency/auto_takeover.png",
									itemId:'emergency_urgent_takeoverfast',
									handler : function(v) {
										//设备在线机器无法进行快速接管
										var device_state=record.raw.status;
										var licenseEmergency=record.raw.licenseEmergency;//1：接管演练权限，2：演练权限 0:无权限
										if(licenseEmergency==1){
											/*if(device_state==1){
												Ext.MessageBox.alert(local.window.tip,local.emergency.cannotStarted);
												return ;
											}else{
												deviceFastEmergency(record.raw.deviceId);
											}*/
											deviceFastEmergency(record.raw.deviceId);
										}else if(licenseEmergency==2){//演练类型创建快速接管
											//演练类型启动快速接管，升级授权类型
											updateLicenseEmergency(record.raw.deviceId);
											
										}else{//无权限时进行权限
											Ext.MessageBox.confirm(local.window.tip,
													local.emergency.deviceNoAuthConfirm,
													function(btn){
												if(btn=='yes'){
													setEmergencyDevice(record.raw.deviceId,1);
												}
											})
										}
									},
									listeners : { 
										afterrender:function(v){
											if(record.raw.clusterIdentity == 1){
												v.setDisabled(true);
												return;
											}
											var licenseFlag_ = record.raw.licenseFlag;
											var deviceType=record.raw.deviceType;
											if(deviceType==3||2 == licenseFlag_){//未授权，切未被设置过应急的标志字段
												v.setDisabled(true);
											}else{
												v.setDisabled(false);
											}
										}
									}  
								},{  
									text : local.emergency.authConfig,   
									icon:"/images/emergency/auto_takeover.png",
									//itemId:'emergency_urgent_takeoverfast',
									handler : function(v) {
										setEmergencyDevice(record.raw.deviceId,1,5);//设备Id，设备快速接管，快速接管
									},  
									listeners : { 
										afterrender:function(v){
											if(record.raw.clusterIdentity == 1){
												v.setDisabled(true);
												return;
											}
											var oracleBackDevice=record.raw.deviceType;
											var licenseFlag_ = record.raw.licenseFlag;
											var licenseEmergency=record.raw.licenseEmergency;
											if(2 == licenseFlag_||oracleBackDevice==3){//未授权
												v.setDisabled(true);
											}else{
												if(licenseEmergency==1||licenseEmergency==2){//已经配置过应急主机，接管，演练
													v.setDisabled(true);
												}else{
													v.setDisabled(false);
												}
											}
										}
									}
								},{
									text : local.emergency.autoTakeover,   
									icon:"/images/emergency/auto_takeover.png",
									itemId:'emergency_urgent_takeoverauto',
									handler : function(v) {
										//TODO 增加自动接管不支持类型
										//设备授权类型
										var licenseEmergency=record.raw.licenseEmergency;//1：接管演练权限，2：演练权限 0:无权限
										if(licenseEmergency==1){
											configAutoTakeOver(record.raw);
										}else if(licenseEmergency==2){//演练类型创建快速接管
											//演练类型启动快速接管，升级授权类型
											updateLicenseEmergency(record.raw.deviceId);
										}else{//无权限时进行权限
											Ext.MessageBox.confirm(local.window.tip,
													local.emergency.deviceNoAuthConfirm,
													function(btn){
												if(btn=='yes'){
													setEmergencyDevice(record.raw.deviceId,3);
												}
											});
										}
									},
									listeners : { 
										afterrender:function(v){
											//集群内单机设备无该功能
											if(record.raw.clusterIdentity == 1){
                                                v.setDisabled(true);
                                                return;
                                            }
											var autoEmergencyFlag=record.raw.autoEmergencyFlag;//0：未授权，1：已授权
											var oracleBackDevice=record.raw.deviceType;
											var licenseFlag_ = record.raw.licenseFlag;
											//未授权设备，不是手动添加设备，没有自动接管权限
											if(oracleBackDevice==3||autoEmergencyFlag==0||licenseFlag_==2){
												v.hide();
											}else{
												v.show();
											}
										}
									}
								},
								{  
									text : local.toRecovery,  
//									itemId:'page_sto',
									icon:"/images/backup/icon_link.png",
									handler : function() { 
										var href = document.getElementById("sel_sto").href;
										window.open(href+"?deviceId="+record.data.id,"_self");
									}, 
									listeners : { 
										afterrender:function(v){
											var licenseFlag_ = record.raw.licenseFlag;
											//未授权设备，不是手动添加设备，没有自动接管权限
											if(licenseFlag_==2){
												v.setDisabled(true);
											}else{
												v.setDisabled(false);
											}
										}
									}
								},
								{  
									text : local.tobackupWarning,  
									icon:"/images/backup/icon_link.png",
									handler : function() { 
										var href = document.getElementById("sel_bac").href;
										window.open(href+"?deviceId="+record.data.id,"_self");
									}, 
									listeners : { 
										afterrender:function(v){
											var licenseFlag_ = record.raw.licenseFlag;
											//未授权设备，不是手动添加设备，没有自动接管权限
											if(licenseFlag_==2){
												v.setDisabled(true);
											}else{
												v.setDisabled(false);
											}
										}
									}
								}
								]);
								nodemenu.showAt(e.getXY());
								POWER_OP.filterEnableMenuOfExtjs(nodemenu,CURRENT_USER.getEmergencyPower());
							}else if(record.data.id.split("-")[1]=="g"){
								//分组右键菜单【只有集群分组拥有功能链接】
                                if(record.raw.groupType==2 || record.raw.groupType==3){
								        nodemenu.removeAll();
                                        //跳转至集群 备份
                                        nodemenu.add({  
                                            text : local.toRecovery,  
                                            icon:"/images/backup/icon_link.png",
                                            handler : function() { 
                                                var href = document.getElementById("sel_sto").href;
                                                window.open(href+"?deviceId="+record.data.id,"_self");
                                            },  
                                            listeners : { 
                                                
                                            } 
                                       });
                                       //跳转至集群 备份
                                        nodemenu.add({  
                                            text : local.tobackupWarning,  
                                            icon:"/images/backup/icon_link.png",
                                            handler : function() {  
                                                var href = document.getElementById("sel_bac").href;
                                                window.open(href+"?deviceId="+record.data.id,"_self");
                                            },  
                                            listeners : { 
                                                
                                            }  
                                       });
                                   
                                    nodemenu.showAt(e.getXY());
                                }
                               
							}
						}
					}
	            }, {
	            	xtype : 'panel',
	            	region : 'center',
	            	itemId : 'contentPanel',
	            	id : 'contentPanel',
	            	layout:'fit',    //没有布局的话，页面超出不能出现滚动条
	            	border:false,
	            	style:'border-left:1px solid #d1dade;',
	            	items : [{
	            		xtype : 'emergency',
	            		itemId : 'emergencyPanel'
	            	}]
	            }];
				
				me.callParent(arguments);
			},
			listeners:{
				afterrender:function(){
					var di = getQueryString('deviceId'); 
					if(null != di){
						var d = new Ext.util.DelayedTask(function(){
							var tree = Ext.getCmp('grobleTreePanel');
							var record = tree.getStore().getNodeById(di);
							Ext.getCmp("grobleTreePanel").getSelectionModel().select(record);
							Ext.getCmp("grobleTreePanel").fireEvent("itemclick",null,record);
						});  
					      d.delay(700); 
					}
				},
				render: function(me) {
					me.el.dom.onclick = function(e){
						closeClusterWin(e);
					}
                }
			}
		});
		
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
} 
function openEmeAndStoWindows(url,data,name){

	/*var tempForm = document.createElement("form"); 
	tempForm.id="tempForm1";
	tempForm.method="post";
	tempForm.action=url;
	tempForm.target=name;

	var hideInput = document.createElement("input");    
	hideInput.type="hidden";    
	hideInput.name= "deviceId";  
	hideInput.value= data;  
	tempForm.appendChild(hideInput);

	if(document.all){  
		tempForm.attachEvent("onsubmit",function(){});        //IE  
	}else{  
		var subObj = tempForm.addEventListener("submit",function(){},false);    //firefox  
	}  
	document.body.appendChild(tempForm);

	tempForm.submit();  
	document.body.removeChild(tempForm);*/ 
}

