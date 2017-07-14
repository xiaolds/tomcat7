Ext.Loader.setConfig({
			enabled : true
		});
Ext.application({
			name : "websure.backup",
			appFolder : '/page/backup/script',
			controllers : ['BackupController'],
			launch : function() {
				Ext.create("websure.backup.mainPanel");
				
			}
		});

/**
 * 备份监控模块主框架
 */
Ext.define('websure.backup.mainPanel', {
			extend : 'Ext.container.Viewport',
			layout : 'border',
			border : false,
			id:'mainPanel',
			minWidth:1250,
			initComponent : function() {
				var me = this;
				me.items = [
				            {
				            	xtype:'GlobalMenu',
				            	region : 'north',
				            	border:false,
				            	height:60
				            },
				            {
								xtype : 'grobleTreePanel',
								region : 'west',
								floating : false,
								height:'100%',
								bodyStyle:'background:#f5f8fa;',
								width : 239,
								listeners : {
									itemdblclick:function(){
										return;
									},
									itemclick:function(record, item, index, e, eOpts ){
										var loadMarsk = new Ext.LoadMask(this, {
												msg : '请稍候...',
												removeMask : true// 完成后移除
										});
										var a =new Ext.util.DelayedTask(function(){  
												loadMarsk.hide();
										});  
										var ids = item.data.id;

								  		if("createGroup" == ids){
								  			Ext.create('websure.backup.view.CreateGroup').show();
								  		} else if (null == item.data.children){	// 单机
								  			var licenseFlag_ = item.raw.licenseFlag;
								  			if(2 == licenseFlag_){
												Ext.MessageBox.alert(local.window.tip, local.unauthDevNoOperate);
												return;
											}
								  			
								  			loadMarsk.show(); //显示
								  			
								  			var deId = item.raw.id.split("-")[0];
								  			var deIp = item.raw.ip;
								  			var deStatus = item.raw.status;
								  			var deText = item.raw.pageText;
								  			var deSysVer = item.raw.sysVersion;
								  			var deCliVersion = item.raw.clientVersion;
								  			var deClientSystype = item.raw.clientSystype;
								  			var deIsStandby = item.raw.standby;
								  			var deviceMac = item.raw.deviceMac;
								  			var deviceType = item.raw.deviceType;
								  			var deviceIco = item.raw.pageIco;
								  			var deuuid = item.raw.uuid;
								  			var licenseWarning = item.raw.licenseWarning;
								  			var licenseWarningSystem = item.raw.licenseWarningSystem;
								  			var licenseWarningDB = item.raw.licenseWarningDB;
								  			var licenseWarningUrl = item.raw.licenseWarningUrl;
								  			var licenseWarningScript = item.raw.licenseWarningScript;
								  			var isClusterDevice = item.raw.clusterIdentity;
								  			var contentPanel = Ext.getCmp('contentPanel');
								  			contentPanel.removeAll();

								  			var deviceBackup = Ext.create("widget.DeviceBackup", {
								  				itemId : 'BackupMonitorsPanel',
												deId : deId,
												deText:deText,
												deIp : deIp,
												deuuid : deuuid,
												deSysVer : deSysVer,
												deCliVersion :deCliVersion,
												deClientSystype:deClientSystype,
												deIsStandby : deIsStandby,
												deStatus : deStatus,
												deMac:deviceMac,
												deviceType:deviceType,
												deviceIco:deviceIco,
												isClusterDevice : isClusterDevice,
												licenseWarning:licenseWarning,
												licenseWarningSystem:licenseWarningSystem,
												licenseWarningDB : licenseWarningDB,
												licenseWarningUrl : licenseWarningUrl,
												licenseWarningScript : licenseWarningScript
								  			});

								  			contentPanel.add(deviceBackup);
								  			contentPanel.doLayout();
								  			clusterId = null;
								  		}else if(null != item.data.children && 0 != item.raw.groupType){//集群
								  			var loadMarsk = new Ext.LoadMask(this, {
												//		msg : '请稍候。。。',
												removeMask : true// 完成后移除
											});
											var a =new Ext.util.DelayedTask(function(){  
											        loadMarsk.hide()
											});  
											
											loadMarsk.show(); //显示
											var clusterText = item.raw.pageText;
											var clusterId = item.raw.id.split("-")[0];
											var deviceCount = item.data.children.length;
											var clusterIco = item.raw.pageIco;
								  			var contentPanel = Ext.getCmp('contentPanel');
								  			contentPanel.removeAll();
								  			contentPanel.add({
								  				xtype : 'ClusterView',
//												itemId : 'BackupMonitorsPanel',
												clusterText : clusterText,
												clusterId : clusterId,
												clusterIco : clusterIco,
												clusterDeviceCount : deviceCount
								  			});//

								  			contentPanel.add(deviceBackup);
								  			contentPanel.doLayout();
								  			
								  			selectDeviceId = null;
								  				//清除定时器
											if(TM_HANDLE_UPDATE != -1) {
												clearInterval(TM_HANDLE_UPDATE);
												TM_HANDLE_UPDATE = -1; 
											}
								  		}
								  		a.delay(800);
									},// 添加监听器,实现右键Tree显示定义菜单myMenu
									'itemcontextmenu' : function(menutree, record, items, index, e) {  
									                e.preventDefault();  
									                //定义右键菜单
									                var nodemenu = new Ext.menu.Menu({
                                                                        floating : true,  
                                                                        items : []  
                                                        });
									                
									                var licenseFlag_ = record.raw.licenseFlag;  //设备是否授权 ==1 已授权 ==2 未授权
									                
									                //设备未授权,给出授权接口
										  			if(2 == licenseFlag_){

										  				nodemenu.removeAll();
										  				nodemenu.add({  
								                            text : '申请设备授权',    //申请设备授权
								                            itemId:'backup_device_apply_auth',
								                            icon:"/images/backup/apply_device_auth.png",
								                            listeners : {
							                            		'click' : function(){
							                            			
                                                                	Ext.MessageBox.confirm(local.window.tip,'确定为该设备申请授权?',function(btn){
                                                                         if(btn == 'yes'){
                                                                        	    var deviceID = record.data.id.split("-")[0];  //设备ID
                                                                            	var applyMask = new Ext.LoadMask(Ext.getBody(), {msg:"正在申请设备授权..."});
                                                                                    applyMask.show();
                                                                                var param = {
                                                                                    deviceId : deviceID
                                                                                };
                                                                                Ext.Ajax.request({
                                                                                        url : '/backup/todeviceAction!applyDeviceAuth.action',
                                                                                        params : param,
                                                                                        timeout: 10000,
                                                                                        success : function(response, options) {
                                                                                            
                                                                                            var obj=Ext.decode(response.responseText);
                                                                                            var code = obj.msgCode;
                                                                                            var content = obj.msgContent;
                                                                                            applyMask.hide();
                                                                                            showResultDialog(code, content);
                                                                                            Ext.getCmp("grobleTreePanel").getStore().reload();
                                                                                            refreshBackupPage(1);
                                                                                        },
                                                                                        failure : function() {
                                                                                        	applyMask.hide();
                                                                                            Ext.websure.MsgError("提示",'申请设备授权失败!');
                                                                                        }
                                                                                });
                                                                         }
                                                                	});
                                                                	
                                                                },
                                                                'afterrender' : function(v){
                                                                    //集群中的设备不能进行授权变更
                                                                    if(record.raw.clusterIdentity == 1){
                                                                        v.hide();
                                                                        return;
                                                                    }
                                                                }
								                            }  
									                   });
										  				
										  			   POWER_OP.filterEnableMenuOfExtjs(nodemenu,CURRENT_USER.getBackupPower());
										               nodemenu.showAt(e.getXY());
										  				
													}else{
														var standby = record.raw.standby;
														
														//已授权的设备/分组 右键菜单
														if(record.data.id.split("-")[1]=="d"){
										                	if(1 == record.raw.deviceType || 2 == record.raw.deviceType){
											                	// 设备为双机
											                	if(1 == standby){// 双机
											                			nodemenu.removeAll();
																		nodemenu.add({  
												                            text :local.cancleDc,  
												                            itemId:'backup_device_canceldual',
												                            icon:"images/common/menu_icon_dc.png",
												                            handler : function() {  
												                            },  
												                            listeners : {
												                            	'click' : function(){
												                            		var param = {
												                            			deviceId : record.data.id.split("-")[0]
												                            		};
												                            		Ext.Ajax.request({
																							url : '/backup/todeviceAction!cancelTwoDevice.action',
																							params : param,
																							success : function(response, options) {
																								
																								var obj=Ext.decode(response.responseText);
																								console.log(obj);
																								var code = obj.msgCode;
																								var content = obj.msgContent;
																								showResultDialog(code, content);
																								Ext.getCmp("grobleTreePanel").getStore().reload();
																							}
																					});
												                            	}
												                            }  
												                        });
																	}else{// 非双机
																		// 取消设置双机按钮 add by Lids on 2017年6月7日11:50:49
											                		/*nodemenu.removeAll();
																		nodemenu.add({  
												                            text : local.configDc,  
												                            icon:"/images/common/menu_icon_dc.png",
												                            itemId:'backup_device_configdual',
												                            handler : function() {  
												                            	var param = {
												                            		deviceId : record.data.id.split("-")[0],
												                            		deviceName : record.data.text
												                            	};
												  								Ext.create("websure.backup.view.DoubleComputerConfig",param).show();
												                            },  
												                            listeners : { 
												                            }  
												                        });*/
											                	}
																
											                   nodemenu.add({  
										                            text : local.addTaskType,  
										                            itemId:'backup_device_addtasktype',
										                            icon:"/images/common/menu_icon_addTask.png",
										                            handler : function() {  
										                            	var param = {
										                            		deviceId : record.data.id.split("-")[0],
										                            		type:record.raw.deviceType
										                            	};
											  							Ext.create("websure.backup.view.AttachedTask",param).show();
										                            },  
										                            listeners : { 
										                            	
										                            }  
											                   });
											                   nodemenu.add(
											                   	'-'
											                   );
											                   
											                   //集群中的设备 无设置双机和附件任务功能
											                   if(record.raw.clusterIdentity == 1){
											                   	     nodemenu.removeAll();
                                                               }
											                   nodemenu.add({  
										                            text : local.toTakeover,  
//										                            itemId:'page_mon',
										                            icon:"/images/backup/icon_link.png",
										                            handler : function() {  
										                            	var href = document.getElementById("sel_mon").href;
										                            	window.open(href+"?deviceId="+record.data.id,"_self");
										                            },  
										                            listeners : { 
										                            	
										                            }  
											                   });
											                   
											                   nodemenu.add({  
										                            text : local.toRecovery,  
//										                            itemId:'page_sto',
										                            icon:"/images/backup/icon_link.png",
										                            handler : function() { 
										                            	var href = document.getElementById("sel_sto").href;
										                            	window.open(href+"?deviceId="+record.data.id,"_self");
										                            },  
										                            listeners : { 
										                            	
										                            } 
											                   });
											                   nodemenu.add(
											                   	'-'
											                   );
										                	}else if(3 == record.raw.deviceType){
										                		nodemenu.removeAll();
										                		 nodemenu.add({  
										                            text : local.addTaskType,
										                            itemId:'backup_device_addtasktype',
										                            icon:"/images/common/menu_icon_addTask.png",
										                            handler : function() {  
										                            	var param = {
										                            		deviceId : record.data.id.split("-")[0],
										                            		type:record.raw.deviceType,
										                            		operaType:1
										                            	};
											  							Ext.create("websure.backup.view.CreateNewDevice",param).show();

										                            },  
										                            listeners : { 
										                            	
										                            }  
											                   });
										                	}
										                	nodemenu.add({  
										                            text : local.deviceDescribe,    //设备描述  
										                            itemId:'backup_device_describe',
										                            icon:"/images/config/tree_output.png",
										                            handler : function() {  
										                            	var param = {
										                            		deviceId : record.data.id.split("-")[0],
										                            		deviceDes : record.raw.pageDes
										                            	};
											  							Ext.create("websure.backup.view.DeviceDesConfig",param).show();

										                            },  
										                            listeners : { 
										                            	
										                            }  
											                   });
											                   
											                   nodemenu.add({  
										                            text : local.addRecordLog,    //添加维护日志
										                            itemId:'backup_device_addmaintenancelog',
										                            icon:"/images/log/log_client.png",
										                            handler : function() {  
										                            	var param = {
										                            		deviceId : record.data.id.split("-")[0]
										                            	};
											  							Ext.create("websure.backup.view.CreateOperationLog",param).show();

										                            },  
										                            listeners : { 
										                            }  
											                   });
											                   
											                   nodemenu.add({  
										                            text : '撤销设备授权',    //撤销设备授权
										                            itemId:'backup_device_repeal_auth',
										                            icon:"/images/backup/repeal_device_auth.png",
										                            listeners : {
										                            	 'click' : function(){
										                            	 	
	                                                                        	Ext.MessageBox.confirm(local.window.tip,'确定撤销此设备的授权?',function(btn){
	                                                                                 if(btn == 'yes'){
	                                                                                        var deviceID = record.data.id.split("-")[0];  //设备ID
	                                                                                    	var repealMask = new Ext.LoadMask(Ext.getBody(), {msg:"正在撤销设备授权..."});
	                                                                                            repealMask.show();
	                                                                                        var param = {
	                                                                                            deviceId : deviceID
	                                                                                        };
	                                                                                        Ext.Ajax.request({
	                                                                                                url : '/backup/todeviceAction!repealDeviceAuth.action',
	                                                                                                params : param,
	                                                                                                timeout: 10000,
	                                                                                                success : function(response, options) {
	                                                                                                    
	                                                                                                    var obj=Ext.decode(response.responseText);
	                                                                                                    var code = obj.msgCode;
	                                                                                                    var content = obj.msgContent;
	                                                                                                    repealMask.hide();
	                                                                                                    showResultDialog(code, content);
	                                                                                                    Ext.getCmp("grobleTreePanel").getStore().reload();
	                                                                                                    //撤消授权之后,刷新备份预警右侧界面
	                                                                                                    refreshBackupPage(2,deviceID);
	                                                                                                },
	                                                                                                failure : function() {
	                                                                                                	repealMask.hide();
	                                                                                                    Ext.websure.MsgError("提示",'撤销设备授权失败!');
	                                                                                                }
	                                                                                        });
	                                                                                 }
	                                                                        	});
	                                                                        },
	                                                                        'afterrender' : function(v){
                                                                                //集群中的设备不能进行授权变更
                                                                                if(record.raw.clusterIdentity == 1){
                                                                                    v.hide();
                                                                                    return;
                                                                                }
                                                                            }
										                            }  
											                   });
											                   
											                   POWER_OP.filterEnableMenuOfExtjs(nodemenu,CURRENT_USER.getBackupPower());
											                   nodemenu.showAt(e.getXY());
										                }else if(record.data.id.split("-")[1]=="g"){
										                	nodemenu.removeAll();
															nodemenu.add({  
									                            text : local.delGroup,    //删除分组
									                            itemId:'backup_device_delgroup',
									                            handler : function() {  
									                            },  
									                            listeners : {
									                            	'click' : function(){
    									                            		var param = {
    									                            			groupId : record.data.id.split("-")[0]
    									                            		};
    									                            		Ext.Msg.show({
    																			title: local.window.warn,
    																			width:350,
    																			style:"background-color:#FFF;",
    																			msg: local.backup.confirmDeleteClusterGroup,
    																			buttons: Ext.MessageBox.YESNO,
    																			fn: function(v) {
    																				if(v == 'yes') {
    																					// Modify by Lids on 2017-05-10 修改为后端验证
    																					//1、首先判断该集群是不是处于还原设置的状态下
    																						Ext.Ajax.request({
    																							url : '/backup/todeviceAction!findClusterState.action',
    																							params : {
    																								clusterId : record.data.id.split("-")[0]
    																							},
    																							success : function(response, options) {
    																								var obj=Ext.decode(response.responseText);
    																								if(4 == obj.result){
    																									
    																									Ext.Ajax.request({
    																											url : '/backup/todeviceAction!deleteCluster.action',
    																											params : param,
    																											success : function(response, options) {
    																												var obj=Ext.decode(response.responseText);
    																												var code = obj.msgCode;
    																												var content = obj.msgContent;
    																												if(MSG_NORMAL==code){
    																													Ext.websure.MsgTip.msg(local.window.tip, content, true);
    																													deleteClusterfadeoutAll();
    //																													var tree = Ext.getCmp("grobleTreePanel").getStore().reload();
    																												}else{
    																													Ext.websure.MsgError(code, content);
    																												}
    																											}
    																									});
    																								} else if(-1 == obj.result){
    																									// 普通分组
    																									Ext.Ajax.request({
																											url : '/backup/todeviceAction!deleteGroup.action',
																											params : {
			    																								groupId : record.data.id.split("-")[0]
			    																							},
																											success : function(response, options) {
																												var obj=Ext.decode(response.responseText);
																												var code = obj.msgCode;
																												var content = obj.msgContent;
																												if(MSG_NORMAL==code){
																													Ext.websure.MsgTip.msg(local.window.tip, content, true);
																													deleteClusterfadeoutAll();
//																													var tree = Ext.getCmp("grobleTreePanel").getStore().reload();
																												}else{
																													Ext.websure.MsgError(code, content);
																												}
																											}
																									});
    																								}
    																								else{//删除集群需要在初始化的情况下才可以操作
    																									Ext.websure.MsgError("WF-30010",local.backup.culsterInitCanDelete);
    																									return;
    																								}
    																							}
    																						});
    																			   }
    																		    },
    																		    icon: Ext.MessageBox.WARNING
    																		});
    									                            	}
									                            }  
									                        });
									                        
									                        //add update group begin
									                        nodemenu.add({
									                            text : local.rename,    //修改分组
									                            itemId:'backup_device_renamegroup',
									                            handler : function() {  
									                            },  
									                            listeners : {
									                            	'click' : function(){
									                            		if("1" == record.data.id.split("-")[0]){
									                            			Ext.MessageBox.alert(local.window.tip, local.backup.modifyGroupCannot);   //该分组为默认分组，无法修改
									                            			return false;
									                            		}
									                            		var param = {
										                            		groupId : record.data.id.split("-")[0],
										                            		groupName : record.raw.groupName
										                            	};
											  							Ext.create("websure.backup.view.GroupNameUpdate",param).show();

									                            	}
									                            }  
									                        });
									                        
									                        //集群分组切换至其他功能快捷方式
									                        if(record.raw.groupType==2 || record.raw.groupType==3){
    									                        	 nodemenu.add(
                                                                          '-'
                                                                     );
									                        	
    									                        	nodemenu.add({  
                                                                        text : local.toTakeover,  
                                                                        icon:"/images/backup/icon_link.png",
                                                                        handler : function() {  
                                                                            var href = document.getElementById("sel_mon").href;
                                                                            window.open(href+"?deviceId="+record.data.id,"_self");
                                                                        },  
                                                                        listeners : { 
                                                                            
                                                                        }  
                                                                   });
                                                               
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
									                        }
                                                           
									                        //add update group end
									                        POWER_OP.filterEnableMenuOfExtjs(nodemenu,CURRENT_USER.getBackupPower());
									                        nodemenu.showAt(e.getXY());
										                }
														
														
													}
									            },
								            'afterrender' : function(menutree, record, items, index, e) {
													/*var item = this.getStore().getNodeById('1-d');
													this.getSelectionModel().select(item);
													Ext.getCmp("grobleTreePanel").fireEvent("itemclick",null,item);*/
													
								            }
								          
										}
						}, {
							xtype : 'panel',
							region : 'center',
							itemId : 'contentPanel',
							id : 'contentPanel',
							layout : 'fit',
							style:'border-left:1px solid #d1dade;',
							border:false,
							items : [{
									xtype : 'BackupView',
									itemId : 'BackupMonitorsPanel'
									}]
						}];

				me.callParent(arguments);
			},
			listeners:{
				afterrender:function(){
					var di = getQueryString('deviceId'); 
					console.log(di);
					if(null != di){
						var d = new Ext.util.DelayedTask(function(){
							var tree = Ext.getCmp('grobleTreePanel');
							var record = tree.getStore().getNodeById(di);
							Ext.getCmp("grobleTreePanel").getSelectionModel().select(record);
							Ext.getCmp("grobleTreePanel").fireEvent("itemclick",null,record);
						});
						d.delay(700); 
					}
				}
			}
});

/**
 * 刷新备份预警右侧页面
 * refType  刷新类型1：申请设备授权刷新,2:撤消设备授权刷新
 */
function refreshBackupPage(refType,itemDeviceId){
	var deviceID = selectDeviceId;  //全局变量，标记备份预警页面被选中的设备ID
	
	//是否处于单设备备份页面
	if(deviceID){
		//撤消授权,且当前撤消的设备等于处于备份监控的设备
		if(refType==2 && (itemDeviceId==deviceID)){
			var contentPanel = Ext.getCmp('contentPanel');
			contentPanel.removeAll();
			contentPanel.add({
						xtype : 'BackupView',
						itemId : 'BackupMonitorsPanel'
					});
			contentPanel.doLayout();
			selectDeviceId = null;  //清除当前选中设备
		}
		//申请授权无需对单设备页面进行处理
	}else{
		//设备分组页面,刷新设备分组
		var a = new ClassDevice();
		a.showFieldSetDevice();
	}
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
} 	

function deleteClusterfadeoutAll() {
	
	var contentPanel = Ext.getCmp('contentPanel');
	contentPanel.removeAll();
	contentPanel.add({
				xtype : 'BackupView',
				itemId : 'BackupMonitorsPanel'
			});
	contentPanel.doLayout();
	//清除定时器
	if(TM_HANDLE_UPDATE != -1) {
		clearInterval(TM_HANDLE_UPDATE);
		TM_HANDLE_UPDATE = -1; 
	}
	selectDeviceId = null;
	
	//清除首页左侧树的选中按钮
	var _len = Ext.getCmp("grobleTreePanel").getSelectionModel().getSelection().length;
	if(_len>0){
		Ext.getCmp("grobleTreePanel").getSelectionModel().clearSelections();
		Ext.getCmp("refresh_tree").fireEvent('click');
	}
}


