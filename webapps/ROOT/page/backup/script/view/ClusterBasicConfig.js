var clusterId = null;//集群Id
var clusterName = null;//集群Name
var clusterType = null;//集群类型 2：集群  3：双机
var clusterBasicCurrentPanel = 1;//用于判断第几个tab页

/**
 * 集群基础配置模块
 */
Ext.define('websure.backup.view.ClusterBasicConfigTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.ClusterBasicConfigTree',
			id : 'clusterBasicConfigTree',
			lines : false,
			collapsible : false,
			rootVisible : false,
			root : {
				text : local.backup.clusterBasicConfig,
				iconCls : 'no-icon',
				expanded : true,
				children : [{
							text : local.backup.basicConfig,	// 基础设置
							id : 'basic_1',
							icon : '/images/common/pc_online_one.png',
							leaf : true
						}, {
							text : local.backup.shareStorage,	// 共享存储
							id : 'basic_2',
							icon : '/images/backup/update.png',
							leaf : true
						}]
			}
});

/**
 * 集群设备展示GRID面板
 * auth:wangerkun
 */

Ext.define("websure.backup.view.DeviceMasterConfig",{
	extend : 'Ext.grid.Panel',
	alias:"widget.DeviceMasterConfig",
	id:'deviceMasterConfig',
	store: "ClusterDeviceStore",
	width:'100%',
	frame:false,
	bodyStyle:'border-color:#d1dade;',
	columns :[
          {
        	  header: local.pcName,
        	  dataIndex: 'deviceShowName',
        	  flex:1,
        	  menuDisabled:true,
        	  sortable: true,
        	  renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
        		  var standbyModel=record.data["standbyModel"];

        		  if(standbyModel==1){ //Master
        			  return "<img class='icon_position' src='/images/common/master.png' />&nbsp;<span title="+value+" style='font-weight:bold;'>"+value+"</span>";
        		  }else{  //Slaver
        			  return value;
        		  }
        	  }
          },
			{  
			  header: local.btn.operate,  
			  width: 120,  
			  menuDisabled: true,  
			  sortable: false,  
			  renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
			  	var deviceId = record.data.deviceId;
			  	var masterCount = record.data.masterCount;
			      if(record.get("standbyModel")==1){
			      			clusterOperMaster = 1;
	        			  return "<a class='color_red'  href='#' onclick='configMaster("+deviceId+","+masterCount+",2);return false;'>"+local.backup.cancleMaster+"</a>"; 
	        		  }else{
	        			 return "<a class='color_green' href='#' onclick='configMaster("+deviceId+","+masterCount+",1);return false;'>"+local.backup.setMaster+"</a>"; 
	        		  }
			  } 
			}
          ],
          listeners:{
        	  afterrender:function(v){
        	  	Ext.getCmp('deviceMasterConfig').getStore().load({
					params : {
						clusterId : clusterId
					}
				}); 
        	  }
          }
});	
		
/**
 * 设置集群的Master
 */	
Ext.define('websure.backup.view.ConfigMaster', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.ConfigMaster',
	id : 'configMaster',
	autoScroll : true,
	overflowY:"auto",
	layout : 'vbox',
	items : [{
	    	   xtype : 'label',
	    	   padding:"0 0 10 0",
	    	   html : "<font class='font_t'>"+local.backup.clusterDeviceList+"</font>",
	    	   width : '100%'
	       },
	       {
				xtype : "DeviceMasterConfig",
				flex:1  
	    	}
	    ]
});

/**
 * 共享磁盘显示
 */
Ext.define('websure.backup.view.ShowClusterShareDisk', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.ShowClusterShareDisk',
			margin:'10 0 10 0',
			autoHeight:true,
			useArrows : true,
			rootVisible : false,
			multiSelect : true, 
			disabled : true,
			sortableColumns:false,
			enableColumnMove:false,
			enableColumnResize:false,
			store:"ClusterShareDiskStore",
			columns : [{
						xtype : 'treecolumn',
						text :local.backup.computerHardName,
						flex : 2,
						menuDisabled:true,
						tdCls:"font_bold",
						dataIndex : 'computerHardName'
					},{
						xtype : 'column',
						text : "hardDiskId",
						flex : 1.5,
						menuDisabled:true,
						dataIndex : 'hardDiskId',
						hidden : true
					},{
						text : local.backup.diskInfoGridSize,
						width:110,
						menuDisabled:true,
						dataIndex : 'totalSector',
						align : 'left'
					}],
			loadMask : {
				msg : local.loading
			}
});


/**
 * 设置集群的共享磁盘
 */	
Ext.define('websure.backup.view.ConfigShareDisk', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.ConfigShareDisk',
	layout : 'vbox',
	items : [],
	listeners : {
		'afterrender' : function() {
			Ext.Ajax.request({
				url : '/backup/todeviceAction!getClusterShareDiskInfo.action',
				params : {
					clusterId : clusterId
				},
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					if(null == obj.info || "" == obj.info){
						clusterOperShare = 0;
						var configShareDisk = Ext.getCmp('configShareDisk');
						configShareDisk.removeAll();
						configShareDisk.add({
				    	   xtype : 'label',
				    	   height:55,
				    	   width:'100%',
				    	   html : local.backup.noShareStorage+"<a class='btn_text_a' href='#' onclick='createShareHardDisk();return false;'>+"+local.backup.newShareStorage+"</a>"
				       })
				         configShareDisk.doLayout();  
					}else{
						clusterOperShare = 1;
						var configShareDisk = Ext.getCmp('configShareDisk');
						configShareDisk.removeAll();
						configShareDisk.add(
	                        	{
	                        	xtype:'panel',
	                        	flex:1,
	                        	width:'100%',
	                        	border:false,
	                        	id:'configShareDiskPanel',
	                        	overflowY:'auto'
	                        	});
	                        var configShareDiskPanel = Ext.getCmp('configShareDiskPanel');
						for(var i = 0;i < obj.info.length;i++){
							var fieldName = obj.info[i].sharediskAlias;
							var clusterSharediskIndex = obj.info[i].clusterSharediskIndex;
	                        configShareDiskPanel.add(
	                        	{
	                            xtype : 'fieldset',
	                            width:570,
	                            id : 'shareFiledset'+i,
	                            name : 'shareFiledset'+i,
	                            clusterSharediskIndex:clusterSharediskIndex,
	                            collapsible: true,//显示切换展开收缩状态的切换按钮 
                    			title :fieldName,
                    			cls:"config_auth_field",
                    			items:[{
		                             xtype: 'button',
		                             text: local.btn.delete0,
		                             clusterId:obj.info[i].clusterId,
		                             clusterSharediskIndex:obj.info[i].clusterSharediskIndex,
		                             width:60,
		                             cls:"ie8 config_ahth_check btn_delete_a",
		                             icon:"/images/config/menu_delete.png",
		                             style:'border:0;',
		                             listeners: {
		                            	 'click':function(){
		                            	 	var shareIndex = this.clusterSharediskIndex;
		                            	 	//删除共享磁盘
		                            	 	Ext.Msg.show({
										        title: local.window.warn,
										        width:350,
										        style:"background-color:#FFF;",
										        msg: local.backup.confirmDeleteShareStorage,
										        buttons: Ext.MessageBox.YESNO,
										        fn: function(v) {
										        	if(v == 'yes') {
										        		
										        		Ext.Ajax.request({
															url : '/backup/toclusterAction!deleteShareHardDisk.action',
															params : {
																clusterId : this.clusterId,
																clusterSharediskIndex:shareIndex
															},
															success : function(response, options) {
																var obj=Ext.decode(response.responseText);
																var code = obj.msgCode;
																var content = obj.msgContent;
																if(MSG_NORMAL==code){
																	Ext.websure.MsgTip.msg(local.window.tip, content, true);
																	var configContentPanel = Ext.getCmp('configContentPanel');
																	configContentPanel.remove(configShareDisk)
																	configContentPanel.add({
																			xtype : 'ConfigShareDisk',
																			id : 'configShareDisk'
																	})
																	configContentPanel.doLayout();  
																}else{
																	Ext.websure.MsgError(code, content);
																}
															}
														});
										        	}
										        },
										        icon: Ext.MessageBox.WARNING
											});
		                            	 }
		                             }
		                         },{
                    				xtype:'ShowClusterShareDisk',
                    				store:Ext.create('websure.backup.store.ClusterShareDiskStore').load({
                    						params:{
                    							clusterId:clusterId,
        										clusterSharediskIndex:clusterSharediskIndex
                    						}
                    					})
                    			}]
	                        });//把获取的items添加到panel中
						}
						 configShareDisk.add({  
					    	   xtype : 'label',
					    	   padding:'10 0 0 0',
					    	   width : '100%',
					    	   html : "<a class='btn_text_a' href='#' onclick='createShareHardDisk();return false;'>+"+local.backup.newShareStorage+"</a>"
						 });
						configShareDisk.doLayout();  
					}

				},
				failure : function() {
					
				}
			});
		}
	}
});

Ext.define("websure.backup.view.ClusterBasicConfig", {
	extend : 'Ext.window.Window',
	title : local.backup.clusterBasicConfig,
	draggable : false,
	height : 600,
	width : 800,
	closable : true,
	cls : 'config',
	id : 'clusterBasicConfigWindow',
	layout : "border",    //窗口布局类型
	modal : true,    //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		clusterId = config.clusterId;
//		clusterType = config.clusterType;
		var me = this;
		me.items = [{
					xtype : 'ClusterBasicConfigTree',
					region : 'west',
					border : false,
					width : 150,
					listeners : {
						afterrender : function() {
							var record = this.getStore().getNodeById('basic_1');
							this.getSelectionModel().select(record);
							changeButtonState(0,1);
						},
						itemclick : function(record, item, index, e, eOpts) {
							var ids = item.data.id;
							if ("basic_1" == ids) {
								Ext.getCmp("configMaster").show();
								Ext.getCmp("configShareDisk").hide();
								
								clusterBasicCurrentPanel = 1;
								changeButtonState(0,1);
							} else if ("basic_2" == ids) {
								Ext.getCmp("configMaster").hide();
								Ext.getCmp("configShareDisk").show();
								
								clusterBasicCurrentPanel = 2;
								changeButtonState(1,0);
							}
						}
					}
				}, {
					xtype : 'form',
					region : 'center',
					id : 'configContentPanel',
					style : 'background:#fff;border-left:1px solid #d1dade;',
					bodyPadding:20,
					border : false,
					layout:'fit',
					items : [{
							xtype : 'ConfigMaster'
						},{
							xtype : 'ConfigShareDisk',
							id : 'configShareDisk'
					}]
				}, {
					xtype : 'panel',
					region : 'south',
					width : '100%',
					border : false,
					style:'background:#fafbfc;border-top:1px solid #d1dade;padding:20px',
					bodyStyle:'background:#fafbfc',
					defaults : {
						style : 'margin-left:10px'
					},
					alias : 'widget.configbuttonfirst',
					layout : 'hbox',
					items : [{flex:1,border:false},
					         {
								xtype : 'button',
								text : local.btn.previous,
								id : 'clusterPreButton',
								handler : function() {
									// 上一步按钮，跳转到基础设置页面
									Ext.getCmp("configMaster").show();
									Ext.getCmp("configShareDisk").hide();
									clusterBasicCurrentPanel = 1;
									changeButtonState(0,1);
								}
							 },
					         {
								xtype : 'button',
								text : local.btn.next,
								id : 'clusterNextButton',
								handler : function() {
									
									// 下一步按钮，跳转到共享页面
									Ext.getCmp("configMaster").hide();
									Ext.getCmp("configShareDisk").show();
									clusterBasicCurrentPanel = 2;
									changeButtonState(1,0);
									
								}
							 },
					         {
								xtype : 'button',
								text : local.close,
								id : 'cancelButton',
								handler : function() {
									if((1 == clusterOperShare) && (1 == clusterOperMaster)){
											Ext.getCmp("clusterBackupconfig").setDisabled(false);
											Ext.getCmp("clusterbaseConfig").setDisabled(false);
									}else{
											Ext.getCmp("clusterBackupconfig").setDisabled(true);
											Ext.getCmp("clusterbaseConfig").setDisabled(false);
									}
									clusterBasicCurrentPanel = 1;
									Ext.getCmp('clusterBasicConfigWindow').destroy();
									//刷新store
									Ext.getCmp("clusterViewShareDiskTree").store.reload();
									updateClusterDeviceList();
								}
							} ]

				}];
		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
			clusterBasicCurrentPanel = 1;
			Ext.getCmp("configMaster").show();
			Ext.getCmp("configShareDisk").hide();
			/*
		
		//获取授权信息
		Ext.Ajax.request({
			url : '/backup/tobackupAction!getSnapAndDataSetLicense.action',
			
			success : function(response, options) {
				var obj = Ext.decode(response.responseText);
				snapNum = obj.snapNum;
				dataSetNum = obj.dataSetNum;
			},
			failure : function() {
				Ext.websure.MsgError("WF-30010",local.backup.getAuthInfoFailure);
			}
		})
		//填充数据
		Ext.Ajax.request({
						url : '/backup/tobackupAction!getDiskCloneConfig.action',
						params : {
							deviceId : parId
						},
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							
								
						},
						failure : function() {
							Ext.websure.MsgError("WF-30010","获取集群相关信息失败！");
						}
					});
		
		*/},
		'close' : function(){
			
			if((1 == clusterOperShare) && (1 == clusterOperMaster)){
				Ext.getCmp("clusterBackupconfig").setDisabled(false);
				Ext.getCmp("clusterbaseConfig").setDisabled(false);
			}else{
					Ext.getCmp("clusterBackupconfig").setDisabled(true);
					Ext.getCmp("clusterbaseConfig").setDisabled(false);
			}
			clusterBasicCurrentPanel = 1;
			Ext.getCmp('clusterBasicConfigWindow').destroy();
			//刷新store
			Ext.getCmp("clusterViewShareDiskTree").store.reload();
			updateClusterDeviceList();
	  	}
	}
});

// 改变集群基础配置按钮的状态
function changeButtonState(preState, nextState){
	var preBut = Ext.getCmp("clusterPreButton");
	var nextBut = Ext.getCmp("clusterNextButton");
	preState ? preBut.enable() : preBut.disable();
	nextState ? nextBut.enable() : nextBut.disable();
}

function configMaster(deviceId,masterCount,type){
	if(1 == type){//设置Master
		if(masterCount >= 1){
			clusterOperMaster = 1;
			Ext.websure.MsgError("WF-30029",local.backup.configMasterOnlyOneTip);
		}else{
			Ext.Ajax.request({
					url : '/backup/todeviceAction!updateDeviceMasterOrSlaver.action',
					params : {
						deviceId : deviceId,
						type : type
					},
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
						console.log(obj);
						var code = obj.msgCode;
						var content = obj.msgContent;
						if(MSG_NORMAL==code){
							Ext.websure.MsgTip.msg(local.window.tip, content, true);
			//				Ext.getCmp("DeviceDesConfig").destroy();
							Ext.getCmp('deviceMasterConfig').getStore().load({
								params : {
									clusterId : clusterId
								}
							}); 
							clusterOperMaster = 1;
						}else{
							Ext.websure.MsgError(code, content);
							clusterOperMaster = 0;
						}
					},
					failure : function() {
						if(1 == type){
							Ext.websure.MsgError("WF-30029",local.backup.configMasterFailure);
						}else{
							Ext.websure.MsgError("WF-30029",local.backup.cancleMasterFailure);
						}
						
					}
			});
		}
	}else{
		Ext.Ajax.request({
				url : '/backup/todeviceAction!updateDeviceMasterOrSlaver.action',
				params : {
					deviceId : deviceId,
					type : type
				},
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					console.log(obj);
					var code = obj.msgCode;
					var content = obj.msgContent;
					if(MSG_NORMAL==code){
						Ext.websure.MsgTip.msg(local.window.tip, content, true);
		//				Ext.getCmp("DeviceDesConfig").destroy();
						Ext.getCmp('deviceMasterConfig').getStore().load({
							params : {
								clusterId : clusterId
							}
						}); 
						clusterOperMaster = 0;
					}else{
						Ext.websure.MsgError(code, content);
						clusterOperMaster = 1;
					}
				},
				failure : function() {
					if(1 == type){
						Ext.websure.MsgError("WF-30029",local.backup.configMasterFailure);
					}else{
						Ext.websure.MsgError("WF-30029",local.backup.cancleMasterFailure);
					}
				}
		});
	}

}

function createShareHardDisk(){
		Ext.create("websure.backup.view.CreateClusterShareHard").show();
}
