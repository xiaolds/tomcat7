var clusterText = null;
var clusterDeviceCount = null;
var clusterId = null;
var clusterIco = null;
var clusterState = null;//集群状态
var clusterOperShare = 0;
var clusterOperMaster = 0;

//轮训失败次数
var failureTimes = 0;

/**
 * 定义控制台的设备列表
 */
Ext.define("websure.backup.view.ClusterDeviceList",{
	extend : 'Ext.grid.Panel',
	alias:"widget.ClusterDeviceList",
	id:'clusterDeviceList',
	store: "ClusterViewDeviceStore",
	features:[{ftype:'grouping'}],
	border:false,
	columns :[
          {
        	  header: local.pcName,
        	  dataIndex: 'deviceName',
        	  flex:1,
        	  menuDisabled:true,
        	  sortable: true,
        	  renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
        		  var standbyModel=record.data["standbyModel"];
        		  
        		  if(value == "共享磁盘"){
        			  return "<img class='icon_position' src='/images/backup/disk.png' />&nbsp;<span title="+value+">"+value+"</span>";
        		  }
        		  
        		  if(standbyModel==1){ //Master
        			  return "<img class='icon_position' src='/images/common/icon_device.png' />&nbsp;<span title="+value+" style='font-weight:bold;'>"
        			  		+value+" "+"<span class='color_green' style='font-weight:bold;'>(Master)</span>"+"</span>";
        		  }else{  //Slaver
        			  return "<img class='icon_position' src='/images/common/icon_device.png' />&nbsp;<span title="+value+">"+value+"</span>";
        		  }
        		  
        		  
        	  }
          },{
			header: local.IP,
			menuDisabled:true,
			flex : 1,
			dataIndex : 'deviceIp'
		 },{
            text : local.state,
            flex : 1,
            menuDisabled:true,
            dataIndex : 'diskCloneState',
            renderer:function(v){
            	if(v==1){
            		//1.运行2.暂停3.异常4.主备切换中（客户端做主备切换的时候，消息服务器判断状态未是否为Reset状态未，如果是Reset则需要拒绝此次主备切换操作。）5.未配置
	        		return "<font class='color_green'>运行中</font>";
	        	}else if(v==2){
	        		return "<font class='color_green'>暂停</font>";
	        	}else if(v == 3){
	        		return "<font class='color_red'>"+local.abnormal+"</font>";
	        	}else if(v == 4){
	        		return "<font class='color_yellow'>主备切换中</font>";
	        	}else if(v == 5){
	        		return "<font class='color_red'>未配置</font>";
	        	}else if(v == 0){
	        		return "<font class='color_red'>未设置</font>";
	        	}else if(v == 6){
	        		return "<font class='color_red'>离线</font>";
	        	}else if(v == -1){
	        		return "<font class='color_green'>已配置</font>";
	        	}else{
	        		return "<font class='color_yellow'>"+local.abnormal+"</font>";
	        	}
	    	  }
          },{
        	header:"进度",
  			menuDisabled:true,
  			flex : 1,
  			renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
  				var progress = record.data["progress"];
  				var speed = record.data["dwSpeedKB"];
  				var state = record.data["diskCloneState"];
  				var phtml = null;
  				var shtml = null;
  				//console.log('speed'+'==='+speed+'&&&'+'progress'+'==='+progress);
  				if(speed == null||speed == 0){
  					shtml = "";
  				}else{
  					shtml = formatSpeedSize(speed);
  				}
  				if(progress == null || progress == 0){
  					if(state == 3||state ==5||state == 0||state == -1||state == 6){
  						phtml = "<div class='progress gray'  ><span style='width:100%'></span></div>";
  					}else{
  						phtml = "<div class='progress'  ><span style='width:100%'></span></div>";
  					}
  				}else{
  					phtml = "<div class='progress' value='"+progress
  	  				+"' ><div>"+progress+"%("+shtml+")</div><span style='width:"+progress+"%'></span></div>";
  				}
  				
  				return phtml;
  			}
          },{
        	  header:"详情",
        	  menuDisabled:true,
        	  flex : 1,
        	  renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
    				return record.data["details"];
    			}
          }],
          listeners:{
        	  afterrender:function(v){
        	  	Ext.getCmp('clusterDeviceList').getStore().load({
					params : {
						clusterId : clusterId
					}
				}); 
        	  }
          }
});	

/**
 * 定义集群控制台 
 */
Ext.define("websure.backup.view.ClusterConsoPanel", {
	extend : 'Ext.panel.Panel',
	alias : 'widget.ClusterConsoPanel',
	width : '100%',
	border : false,
	layout : {
		type : 'vbox'
	},
	defaults : {
		border : false
	},
	items : [{
		width : '100%',
		height : 42,
		layout : 'hbox',
		border : false,
		id : 'clusterConsol',
		cls : 'consol_1',
		bodyPadding : '7 10 0 20',
		bodyStyle : 'background:none',
		defaults : {
			border : false
		},
		items : [{
			width : 300,
			id : 'clusterControllerState',
			padding : '2 10 0 0',
			bodyStyle : 'background:none;',
			html : "<div  class='font_h4'><font color='#ffffff'>"
					+ local.backup.clientState
					+ "</font><font color='#ffff00'>"
					+ local.backup.clientStateNo + "</font></div>",
			listeners : {}
		}, {
			flex : 1
		}, {
			width : 90,
			xtype : 'button',
			text : local.btn.operate,
			id : 'clusterOperateButton',
			bodyStyle : 'background:#555555;',
			icon : '/images/common/arrow_down.png',
			iconAlign : 'right',
			listeners : {
				'click' : clusterShowCDPCtrlMenu
			}
		}]
	}, {
		flex : 1,
		layout : 'hbox',
		style : 'border:1px solid #e3eaec;border-top:0;',
		width : '100%',
		layout:'fit',
		items : [
			{
				xtype:'ClusterDeviceList'
			}
		]
	}]
});
//磁盘信息
Ext.define('websure.backup.view.ClusterViewShareDiskTreePanel', {
			extend : 'Ext.panel.Panel',
			border : false,
			alias : 'widget.ClusterViewShareDiskTreePanel',
			//layout:'fit',
			overflowY:"auto",
			items : [ {
						xtype :'ClusterViewShareDiskTree'
					}]

		});
//集群详情==》共享盘信息
Ext.define('websure.backup.view.ClusterViewShareDiskTree',{
    extend:'Ext.tree.Panel',
    alias:'widget.ClusterViewShareDiskTree',
    id:"clusterViewShareDiskTree",
    useArrows:true,
    rootVisible:false,
    border:false,
    frame:false,
    loadMask : {
        msg : local.loading
    },
	disabled : true,
	cls:"grid_border",
    initComponent : function() {
        var me = this;
        var clusterShareDiskStore=Ext.create("websure.backup.store.ClusterShareDiskTreeStore");
        clusterShareDiskStore.load({params:{clusterId:clusterId}});
        Ext.applyIf(me, {
            store:clusterShareDiskStore,
            columns : [{
                xtype : 'treecolumn',
                text : local.backup.deviceDiskPartition,
                flex : 2.5,
                menuDisabled:true,
                dataIndex : 'device_hard_partition_Name'
            },{
                text : 'id',
                flex : 1,
                menuDisabled:true,
                dataIndex : 'deviceId',
				hidden : true
            },{
                text : local.backup.mountInfoDot,
                flex : 1,
                menuDisabled:true,
                dataIndex : 'mountInfo'
            },{
				menuDisabled:true,
                text : local.capacity,
                flex : 1,
                dataIndex : 'totalSector',
                align : 'center'
            },{
                text : local.backup.diskInfoGridFormat,
                flex : 0.9,
                menuDisabled:true,
                dataIndex : 'fileSystem'
            }
            ]
        });
        me.callParent(arguments);
    }
});

// 磁盘信息
Ext.define('websure.backup.view.ClusterDiskinfoPanel', {
			extend : 'Ext.panel.Panel',
			id : 'clusterDiskinfoPanel',
			border : false,
			alias : 'widget.ClusterDiskinfoPanel',
			items : [{
						xtype : 'ClusterShareDiskinfoList'
					}]
		});

// 备份策略
Ext.define('websure.backup.view.ClusterBackupStrategy', {
            extend : 'Ext.grid.Panel',
			alias : 'widget.ClusterBackupStrategy',
			id : 'clusterBackupStrategy',
			store : 'ClusterStrategyInfoStore',
            border:false,
            bodyBorder:false,
            hideHeaders : true,
            width:"100%",
            columns: [                    
                      { header: local.name, width: 140,  dataIndex: 'showName', align: 'left'},
                      { header: local.content, width: "50%",tdCls:"font_color_999",  dataIndex: 'showContent'},
                      { header: local.btn.operate, flex:1, dataIndex:'op',align:'right'} 
                     ],
	         loadMask:{
		      msg:local.dataLoading
		    }
        });
        
// 设备日志
Ext.define('websure.backup.view.ClusterDeviceLog', {
            extend : 'Ext.grid.Panel',
			alias : 'widget.ClusterDeviceLog',
			id : 'clusterDeviceLog',
			store : 'ClusterDeviceLogStore',
            width:"100%",
            columns: [
            		  { header: local.num, width:80, menuDisabled:true,dataIndex: 'diskCloneLogId'},
            		  { header:local.log.gridEvent+ 'ID', menuDisabled:true,width:90, dataIndex: 'diskCloneEventId'},
                      { header: local.log.gridLevel, menuDisabled:true,width:100,  dataIndex: 'diskCloneLogLevel',	
     	                        	  renderer:function(v){
		 	                        	  	if(v == 1){
							        			return "<img src='/images/log/normal.gif' align='absmiddle' />&nbsp;"+local.normal;
							        		}else if(v == 2){
							        			return "<img src='/images/log/error.gif' align='absmiddle' />&nbsp;"+local.defaulty;
							        		}else if(v == 3){
							        			return "<img src='/images/log/warning.gif' align='absmiddle' />&nbsp;"+local.warn;
							        		}
     	                        	  }
     	              },
     	              { header: local.log.gridSource, menuDisabled:true,tdCls:"font_color_999",flex:1.4, dataIndex: 'diskCloneLogIp'},
                      { header: local.log.gridTime,menuDisabled:true, tdCls:"font_color_999",width:150,dataIndex: 'diskCloneLogCreateTimeForPage'},
                      { header: local.content,flex:4, tdCls:"font_color_999",dataIndex:'diskCloneLogContent', 
						renderer: function(value,metaData,record,colIndex,store,view) {
   	        		   return  '<div title="' + value + '">' + value + '</div>';
   	        	   }} 
                     ],
	         loadMask:{
		      msg:local.dataLoading
		    },
		    dockedItems : [{
							xtype : 'pagingtoolbar',
							store : 'ClusterDeviceLogStore', // same store GridPanel is using
							dock : 'bottom', //分页 位置
							emptyMsg : local.toobarEmptyMsg,
							displayInfo : true,
							displayMsg : local.toolbarDisplayMsg,
							beforePageText : local.toolbarBeforePageText,
							afterPageText : local.toolbarAfterPageText,
							 listeners : {  
				                      beforechange : function(obj, pdata, options) {
				                      	
				                      		var store = Ext.getCmp('clusterDeviceLog').store;
				                      	
				                      	    store.on("beforeload",function(){
												        Ext.apply(store.proxy.extraParams, {clusterId : clusterId});
												    });
					                    }  
					                }
							} 
						  ]
        });

// 定义备份详情tab页
Ext.define('websure.backup.view.ClusterDetailPanel', {
			extend : 'Ext.tab.Panel',
			alias : 'widget.ClusterDetailtabPanel',
			plain : true,
			enableTabScroll : true,
			bodyStyle : 'background:#fff;border-color:#e3eaec;',
			resizeTabs : true,
			cls : 'tab_s tab_1',
			activeTab : 0,
			width : '100%',
			margin : '10 0 0 0',
			items : [{
						title : local.backup.clusterShareDiskTreeInfo,
						itemId : '1',
						xtype : "ClusterViewShareDiskTreePanel"
					}, {
						title : local.backup.tabBackupStrategy,
						itemId : '2',
						xtype : "ClusterBackupStrategy",
						listeners : {
							afterrender : function(){
							}
						}
					}, {
						title : local.backup.tabLog,
						itemId : '3',
						xtype : "ClusterDeviceLog"
					}],
			listeners : {
				'tabchange' : function(tabPanel, newCard, oldCard) {
					var itemi = tabPanel.activeTab.itemId;
					if (2 == itemi) {
						// 备份策略详情
						Ext.getCmp("clusterBackupStrategy").store.load({
						params : {
							clusterId : clusterId
						}
					});
					} else if (3 == itemi) {
						//设备操作日志
						Ext.getCmp("clusterDeviceLog").store.load({
						params : {
							clusterId : clusterId
						}
					});
					}
				}
			}
		});

// 备份tab页
Ext.define('websure.backup.view.ClusterBackupTab', {
			extend : 'Ext.panel.Panel',
			border : false,
			alias : 'widget.ClusterBackupTab',
			style : 'background:#fff;',
			layout : 'vbox',
			overflowY:"auto",
			bodyPadding:20,
			items : [{
				xtype : 'label',
				id : 'clusterLabelConsole',
				html : "<font class='font_t'>"+local.backup.clusterConsole+"</font>",
				width : '90%'
			}, {
				xtype : 'ClusterConsoPanel',
				height : 320,
				margin : '12 0 24 0'
			}, {
				xtype : 'label',
				id : 'clusterLabeldetail',
				html : "<font class='font_t'>"+local.backup.clusterInfo+"</font>",
				width : '100%'
			}, {
				xtype : 'ClusterDetailtabPanel',
				id:'clusterDetailtabPanel',
			    height:430
			}]
		});

// 定义tab页
Ext.define('websure.backup.view.ClusterTabPanel', {
			extend : 'Ext.tab.Panel',
			alias : 'widget.ClusterTabPanel',
			plain : true,
			enableTabScroll : true,
			style : 'background:#fafbfc;',
			bodyStyle : 'background:#fafbfc;border:0;border-top:1px solid #d1dade',
			resizeTabs : true,
			cls : 'tab_big',
			activeTab : 0,
			items : [{
						title :local.backup.clusterBackupTab,
						xtype : "ClusterBackupTab",
						listeners : {
							'activate':function(){
								Ext.getCmp("clusterBackupconfig").setText(local.btn.backupConfig);
							}
						}
					}
//隐藏监控预警的tab
//			, {
//						title : local.backup.tabTitleWarn,
//						xtype : "ClusterForeWarningTab",
//						border:false,
//						listeners : {
//							'activate':function(){
//								Ext.getCmp("clusterBackupconfig").setText(local.backup.diskWarnConfig);
//							}
//						}
//			}
			]
		});

Ext.define("websure.backup.view.ClusterView", {
	extend : 'Ext.panel.Panel',
	alias : 'widget.ClusterView',
	id : 'clusterView',
	bodyStyle : 'background:#fafbfc;',
	border : false,	
	layout:"vbox",
	constructor : function(config) {
				clusterText = config.clusterText;
				clusterDeviceCount = config.clusterDeviceCount;
				clusterId = config.clusterId;
				clusterIco = config.clusterIco;
				var me = this;
				me.items = [
						{
						xtype : "panel",
						id : 'topPanel',
						width : '100%',
						bodyStyle : 'background:#fafbfc;',
						height : 146,
					    layout:'hbox',
						border : false,
						items : [{
							flex:1,
							height:'100%',
							xtype : "panel",
							border : false,
							layout : 'hbox',
							bodyStyle : 'background:#fafbfc;',
							items : [{
										xtype : "panel",
										flex:1,
										id : 'clusterDetailInfo',
										border : false,
										padding : 25,
										bodyStyle : 'background:#fafbfc;',
										html : "<div><img style='display:block;float:left' src='/images/backup/"+clusterIco+"'></img><div style='float:left;margin-left:4px;'><font class='font_h3'>"
												+ clusterText
												+ "</font></br>"
												+ clusterDeviceCount
												+ local.backup.title2+"</div></div>"
									},{
										padding : '54 30 30 30',
										border : false,
										bodyStyle : 'background:#fafbfc;',
										items :[ {
											xtype : 'button',
											id : 'clusterbaseConfig',
											width : 118,
											height : 35,
											cls : 'btn_big',
											style : 'padding-left:22px;background:#0aa;border-color:#099;',
											icon : '/images/common/set.png',
											itemId:'backup_device_cluster_basic_config',         
											text : local.backup.basicConfig,
											handler :function(){
													var param = {
					                            		clusterId : clusterId,
					                            		clusterName : clusterText
					                            	};
						  							Ext.create("websure.backup.view.ClusterBasicConfig",param).show();
												}
										},{
											xtype : 'button',
											id : 'clusterBackupconfig',
											itemId : 'backup_device_cluster_backup_config',
											width : 118,
											height : 35,
											cls : 'btn_big',
											//itemId:'cluster_backup_config',
											style : 'margin-left:10px;padding-left:22px;background:#0aa;border-color:#099;',
											icon : '/images/common/set.png',
											text : local.btn.backupConfig,
											listeners:{
												'click':function(){
													var param = {
					                            		clusterId : clusterId
					                            	};
						  							Ext.create("websure.backup.view.ClusterBackupConfig",param).show();
												}
											}
											/*handler :function(){
													var param = {
					                            		clusterId : clusterId
					                            	};
						  							Ext.create("websure.backup.view.ClusterBackupConfig",param).show();
												}*/
										}]
									}, {
										xtype : "panel",
										id : 'clusterShrink',
										border : false,
										height:'100%',
										width : 56,
										html : "<div class='shrink' onclick='fadeoutAll();'><img id='backImg' src='/images/backup/shrink.png' /></div>"
									}]
				
								}]
							}, {
								style : 'margin-top:-38px',
								width:"100%",
								flex:1,
								xtype : 'ClusterTabPanel'
							}			
						];
				me.callParent(arguments);
			}, 	
	listeners : {
		afterrender : function() {
			// 备份控制台
			Ext.Ajax.request({
				url : '/backup/toclusterAction!getClusterInfoByClusterId.action',
				params : {
					clusterId : clusterId
				},
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					clusterOperShare = obj.clusterOperaShare;
					clusterOperMaster = obj.clusterOperaMaster;
					if (null != obj.detail) {
						clusterState = obj.detail.clusterState;
						//cluster状态
						//1.运行2.暂停3.异常 4.未设置
						//1不在线-灰色#ccc 2运行-绿色#68ba8a 3 暂停-绿色#68ba8a 4异常-红色#f75a53 5 reset-蓝色 #3a7ea5 6 未设置-黄色 #abad23
						if (4 == clusterState) {// 4 未设置
							initStateClu();
							if((1 == clusterOperShare) && (1 == clusterOperMaster)){
									Ext.getCmp("clusterBackupconfig").setDisabled(false);
									Ext.getCmp("clusterbaseConfig").setDisabled(false);
							}else{
									Ext.getCmp("clusterBackupconfig").setDisabled(true);
									Ext.getCmp("clusterbaseConfig").setDisabled(false);
							}
						} else if(2 == clusterState) {// 2 暂停
							stopStateClu();
							Ext.getCmp("clusterBackupconfig").setDisabled(false);
							Ext.getCmp("clusterbaseConfig").setDisabled(true);
						}else if(1 == clusterState) {// 1 运行
							runStateClu();
							Ext.getCmp("clusterBackupconfig").setDisabled(true);
							Ext.getCmp("clusterbaseConfig").setDisabled(true);
						}else if(6 == clusterState){//离线
							offLineStateClu();
							Ext.getCmp("clusterBackupconfig").setDisabled(true);
							Ext.getCmp("clusterbaseConfig").setDisabled(true);
						}else {// 3 异常
							excepStateClu();
							Ext.getCmp("clusterBackupconfig").setDisabled(true);
							Ext.getCmp("clusterbaseConfig").setDisabled(true);
						} 
				}else{
					excepStateClu();
				}
				
//				POWER_OP.filterEnableWidgetsOfExtjs(v,CURRENT_USER.getBackupPower());	
				},
				failure : function() {
					Ext.websure.MsgError("WF-30019", local.backup.getClusterBackupStateFailure);
				}
			});
		}
	}
});

//备份策略设置
function setClusterStrategy(type){
	if(clusterState == 1){
		Ext.MessageBox.alert(local.window.tip, "集群运行中，无法更改设置");
		return;
	}
	
	Ext.getCmp('clusterBackupconfig').fireEvent('click');
		var d = new Ext.util.DelayedTask(function(){  
			if(2 == type){
				Ext.getCmp("clusterConfigdatasoure").hide();
				Ext.getCmp("clusterConfigStrategy").show();
				Ext.getCmp("clusterSnapStrategy").hide();
				clusterCurrentPanel = 2;
				Ext.getCmp("clusterPreButton").show();
				Ext.getCmp("clusterNextButton").show();
				
				var tree = Ext.getCmp('clusterConfigTree');
				var record = tree.getStore().getNodeById('cluster_backup_2');
				tree.getSelectionModel().select(record);
			}else if(3 == type){
				Ext.getCmp("clusterConfigdatasoure").hide();
				Ext.getCmp("clusterConfigStrategy").hide();
				Ext.getCmp("clusterSnapStrategy").show();
				clusterCurrentPanel = 3;
				Ext.getCmp("clusterPreButton").show();
				Ext.getCmp("clusterNextButton").hide();
				
				var tree = Ext.getCmp('clusterConfigTree');
				var record = tree.getStore().getNodeById('cluster_backup_3');
				tree.getSelectionModel().select(record);
			}
	     });  
	    d.delay(700);
}

/**
 * 定义操作菜单
 */
Ext.define('websure.backup.view.ClusterOperateMenu', {
		extend : 'Ext.menu.Menu',
		id : 'clusterOperateMenu',
		style : {
			overflow : 'visible'
		},
		items : [{
					text : local.btn.start,
					id : "clusterStartMenuItem",
					itemId:'backup_device_cluster_backup_star',
					listeners : {
						click : clusterStartMenu
					}
				}, {
					text : local.btn.stop,
					id : "clusterStopMenuItem",
					itemId:'backup_device_cluster_backup_stop',
					listeners : {
					  click:clusterStopMenu
					}
				}, '-', {
					text : local.backup.imeRun,
					id : "clusterImediateSynMenuItem",
					itemId:'backup_device_cluster_backup_imediasync',
					listeners : {
					  click:clusterImediateSynMenu
					  }
				}, {
					text : local.backup.imeSnap,
					itemId:'backup_device_cluster_backup_imediasnap',
					id : "clusterImediateSnapMenuItem",
					listeners : {
					  click:clusterImediateSnapMenu
					 }
				}, {
					text : local.backup.checkData,
					itemId:'backup_device_cluster_backup_checkdata',
					id : "clusterCheckdataMenuItem",
					listeners : {
					 click:clusterCheckdataMenu
					 }
				}, '-', {
					text : local.backup.configInit,
					itemId:'backup_device_cluster_backup_configinit',
					id : "clusterInitMenuItem",
					listeners : {
						click:clusterInitMenu
					}
			}]
});
var clusterOperaMenu = Ext.create("websure.backup.view.ClusterOperateMenu");

// 显示操作下拉菜单
function clusterShowCDPCtrlMenu(button, e) {
	//获取cluster状态信息
	Ext.Ajax.request({
		url : '/backup/toclusterAction!getclusterState.action',
		params : {
			clusterId : clusterId
		},
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			if(clusterState != obj.msg){
				clusterState = obj.msg;
				clusterState = clusterState;
				if (4 == clusterState) {// 4 未设置
					initStateClu();
				} else if(2 == clusterState) {// 2 暂停
					stopStateClu();
				}else if(1 == clusterState) {// 1 运行
					runStateClu();
				}else if(6 == clusterState){//离线
					offLineStateClu();
				}else{// 3 异常
					excepStateClu();
				} 
				//如果是运行状态，设置按钮disabled
				if(1 == clusterState){
					Ext.getCmp("clusterBackupconfig").setDisabled(true);
				}else{
					Ext.getCmp("clusterBackupconfig").setDisabled(false);
				}
			}
			
			//根据diskClone状态来显示相应的菜单
			//diskClone状态
			//1.运行2.暂停3.异常4.未设置
			if(2 == clusterState){//暂停
				Ext.getCmp('clusterStartMenuItem').setDisabled(false);
				Ext.getCmp('clusterStopMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSynMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSnapMenuItem').setDisabled(true);
				Ext.getCmp('clusterCheckdataMenuItem').setDisabled(true);
				Ext.getCmp('clusterInitMenuItem').setDisabled(false);
			}else if(4 == clusterState){//未设置
				Ext.getCmp('clusterStartMenuItem').setDisabled(true);
				Ext.getCmp('clusterStopMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSynMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSnapMenuItem').setDisabled(true);
				Ext.getCmp('clusterCheckdataMenuItem').setDisabled(true);
				Ext.getCmp('clusterInitMenuItem').setDisabled(false);
			}else if(1 == clusterState){//运行中，启动状态
				if(workState_menu == 6){
					Ext.getCmp('clusterStartMenuItem').setDisabled(true);
					Ext.getCmp('clusterStopMenuItem').setDisabled(false);
					Ext.getCmp('clusterImediateSynMenuItem').setDisabled(false);
					Ext.getCmp('clusterImediateSnapMenuItem').setDisabled(false);
					Ext.getCmp('clusterCheckdataMenuItem').setDisabled(false);
					Ext.getCmp('clusterInitMenuItem').setDisabled(false);
				}else{
					Ext.getCmp('clusterStartMenuItem').setDisabled(true);
					Ext.getCmp('clusterStopMenuItem').setDisabled(false);
					Ext.getCmp('clusterImediateSynMenuItem').setDisabled(true);
					Ext.getCmp('clusterImediateSnapMenuItem').setDisabled(true);
					Ext.getCmp('clusterCheckdataMenuItem').setDisabled(true);
					Ext.getCmp('clusterInitMenuItem').setDisabled(true);
				}
			}else if(6 == clusterState){
				Ext.getCmp('clusterStartMenuItem').setDisabled(true);
				Ext.getCmp('clusterStopMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSynMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSnapMenuItem').setDisabled(true);
				Ext.getCmp('clusterCheckdataMenuItem').setDisabled(true);
				Ext.getCmp('clusterInitMenuItem').setDisabled(true);
			}else{//异常
				Ext.getCmp('clusterStartMenuItem').setDisabled(true);
				Ext.getCmp('clusterStopMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSynMenuItem').setDisabled(true);
				Ext.getCmp('clusterImediateSnapMenuItem').setDisabled(true);
				Ext.getCmp('clusterCheckdataMenuItem').setDisabled(true);
				Ext.getCmp('clusterInitMenuItem').setDisabled(false);
			}
//			POWER_OP.filterEnableMenuOfExtjs(clusterOperaMenu,CURRENT_USER.getBackupPower());
			clusterOperaMenu.showBy(button);
		},
		failure : function() {
//				Ext.MessageBox.alert(local.window.tip, local.backup.seekDiskCloneStateFailue);
			Ext.websure.MsgError("WF-30022", local.backup.seekDiskCloneStateFailue);
		}
	});
}

function clusterStartMenu(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.startMsg});
	myMask.show();
	//启动备份
	Ext.Ajax.request({
				url : '/backup/toclusterAction!clusterStart.action',
				params : {
					clusterId : clusterId
				},
				success : function(response, options) {
					
					var obj=Ext.decode(response.responseText);
					//console.log(obj);
					var code = obj.msgCode;
					var content = obj.msgContent;
					if(MSG_NORMAL==code){
						Ext.websure.MsgTip.msg(local.window.tip, content, true);
						runStateClu();
						clusterState = 1;
						if(1 == clusterState){
							Ext.getCmp("clusterBackupconfig").setDisabled(true);
						}else{
							Ext.getCmp("clusterBackupconfig").setDisabled(false);
						}
						
					}else{
						Ext.websure.MsgError(code, content);
					}
					myMask.hide();
				},
				failure : function() {
					Ext.websure.MsgError("WF-30023", local.backup.startClusterFailure);
					myMask.hide();
				}
			});
};

function clusterStopMenu(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.stopMsg});
	myMask.show();
	//停止备份
	Ext.Ajax.request({
				url : '/backup/toclusterAction!clusterStop.action',
				params : {
					clusterId : clusterId
				},
				success : function(response, options) {
					
					var obj=Ext.decode(response.responseText);
					var code = obj.msgCode;
					var content = obj.msgContent;
					if(MSG_NORMAL==code){
						Ext.websure.MsgTip.msg(local.window.tip, content, true);
						stopStateClu();
						clusterState = 2;
						if(1 == clusterState){
							Ext.getCmp("clusterBackupconfig").setDisabled(true);
						}else{
							Ext.getCmp("clusterBackupconfig").setDisabled(false);
						}
						
					}else{
						Ext.websure.MsgError(code, content);
					}
					clearTimer();
					myMask.hide();
				},
				failure : function() {
					Ext.websure.MsgError("WF-30023", local.backup.startClusterFailure);
					myMask.hide();
				}
			});
};

function clusterImediateSynMenu(){
	//web发起快照任务，需要判断Master节点是否在线，Master节点不在线则此次快照命令不发送
	Ext.Ajax.request({
		url : '/backup/toclusterAction!checkClusterMasterIsOnLine.action',
		params : {
			clusterId : clusterId
		},
		success : function(response, options) {
			
			var obj=Ext.decode(response.responseText);
			var code = obj.info;
			if(obj.info > 0){
				clusterImmediate(2);
				
			}else{
				Ext.websure.MsgError("WF-30023", local.backup.clusterMasterOfflineCanntSnap);
			}
		},
		failure : function() {
			Ext.websure.MsgError("WF-30023", local.backup.clusterMasterOnlineFailure);
		}
	});
};

function clusterImediateSnapMenu(){
	//web发起快照任务，需要判断Master节点是否在线，Master节点不在线则此次快照命令不发送
	Ext.Ajax.request({
		url : '/backup/toclusterAction!checkClusterMasterIsOnLine.action',
		params : {
			clusterId : clusterId
		},
		success : function(response, options) {
			
			var obj=Ext.decode(response.responseText);
			var code = obj.info;
			if(obj.info > 0){
				clusterImmediate(1);
				
			}else{
				Ext.websure.MsgError("WF-30023", local.backup.clusterMasterOfflineCanntSnap);
			}
		},
		failure : function() {
			Ext.websure.MsgError("WF-30023", local.backup.clusterMasterOnlineFailure);
		}
	});
};

function clusterCheckdataMenu(){
	if(TM_HANDLE_UPDATE != -1) {
		clearInterval(TM_HANDLE_UPDATE);
		TM_HANDLE_UPDATE = -1; 
	}
	//web发起快照任务，需要判断Master节点是否在线，Master节点不在线则此次快照命令不发送
	Ext.Ajax.request({
		url : '/backup/toclusterAction!checkClusterMasterIsOnLine.action',
		params : {
			clusterId : clusterId
		},
		success : function(response, options) {
			
			var obj=Ext.decode(response.responseText);
			var code = obj.info;
			if(obj.info > 0){
				clusterCheckdata();
				
			}else{
				Ext.websure.MsgError("WF-30023", local.backup.clusterMasterOfflineCanntSnap);
			}
		},
		failure : function() {
			Ext.websure.MsgError("WF-30023", local.backup.clusterMasterOnlineFailure);
		}
	});
};

function clusterCheckdata(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.startMsg});
	myMask.show();
	//校验数据
	Ext.Ajax.request({
				url : '/backup/toclusterAction!clusterCheckDate.action',
				params : {
					clusterId : clusterId
				},
				success : function(response, options) {
					
					var obj=Ext.decode(response.responseText);
					var code = obj.msgCode;
					var content = obj.msgContent;
					if(MSG_NORMAL==code){
						Ext.websure.MsgTip.msg(local.window.tip, content, true);
						runStateClu();
						clusterState = 1;
						if(1 == clusterState){
							Ext.getCmp("clusterBackupconfig").setDisabled(true);
						}else{
							Ext.getCmp("clusterBackupconfig").setDisabled(false);
						}
						
					}else{
						Ext.websure.MsgError(code, content);
					}
					myMask.hide();
				},
				failure : function() {
					Ext.websure.MsgError("WF-30023", local.backup.dataOrderSendOvertime);
					myMask.hide();
				}
			});
	
	updateClusterDeviceList();
	if(TM_HANDLE_UPDATE == -1) {
		updateCluster();
		TM_HANDLE_UPDATE = setInterval(updateCluster, 4000);	
	}
}

function clusterImmediate(type){//type=2 同步  type=1 快照  
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.startMsg});
	myMask.show();
		//立即快照或同步
	Ext.Ajax.request({
				url : '/backup/toclusterAction!clusterImmediate.action',
				params : {
					clusterId : clusterId,
					type:type
				},
				success : function(response, options) {
					
					var obj=Ext.decode(response.responseText);
					var code = obj.msgCode;
					var content = obj.msgContent;
					if(MSG_NORMAL==code){
						Ext.websure.MsgTip.msg(local.window.tip, content, true);
						runStateClu();
						clusterState = 1;
						if(1 == clusterState){
							Ext.getCmp("clusterBackupconfig").setDisabled(true);
						}else{
							Ext.getCmp("clusterBackupconfig").setDisabled(false);
						}
						
					}else{
						Ext.websure.MsgError(code, content);
					}
					myMask.hide();
				},
				failure : function() {
					if(type == 1){
						Ext.websure.MsgError("WF-30023",local.backup.snapOrderSendOvertime);
					}else{
						Ext.websure.MsgError("WF-30023", local.backup.synOrderSendOvertime);
					}
					
					myMask.hide();
				}
			});
}

function clusterInitMenu(){
	//web发起集群设置还原需要判断集群设备是否都在线，集群中任意一个客户端不在线集群设置还原命令不发送
		Ext.Msg.show({
	        title: local.window.warn,
	        width:350,
	        style:"background-color:#FFF;",
	        msg: local.backup.initConfirmStopCloneMsg,
	        buttons: Ext.MessageBox.YESNO,
	        fn: function(v) {
	        	if(v == 'yes') {
	        		var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.initMsg});
					myMask.show();
		    		//备份初始化
					Ext.Ajax.request({
						url : '/backup/toclusterAction!clusterReset.action',
						params : {
							clusterId : clusterId
						},
						success : function(response, options) {
							var obj=Ext.decode(response.responseText);
							var code = obj.msgCode;
							var content = obj.msgContent;
							if(MSG_NORMAL==code){
								Ext.websure.MsgTip.msg(local.window.tip, content, true);
								diskCloneStatus = 4;
	        					initStateClu();
	        					Ext.getCmp("clusterBackupconfig").setDisabled(true);
	        					Ext.getCmp("clusterbaseConfig").setDisabled(false);
	        					
	        					Ext.getCmp("clusterViewShareDiskTree").store.reload();
							}else{
								Ext.websure.MsgError(code, content);
							}
							myMask.hide();
						},
						failure : function() {
							Ext.websure.MsgError("WF-30028",local.backup.clusterInitOrderSendFailure);
							myMask.hide();
						},
						timeout: 20000
					});
	        	}
	        },
	        icon: Ext.MessageBox.WARNING
		});
}

//离线状态-灰色
function offLineStateClu(){
	Ext.getCmp("clusterControllerState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.backup.offline+"</font></div>");
	Ext.getCmp("clusterConsol").removeCls("consol_3");
	Ext.getCmp("clusterConsol").removeCls("consol_2");
	Ext.getCmp("clusterConsol").removeCls("consol_4");
	Ext.getCmp("clusterConsol").removeCls("consol_5");
	Ext.getCmp("clusterConsol").removeCls("consol_6");
	Ext.getCmp("clusterConsol").addCls("consol_1");
	updateClusterDeviceList();
}

//停止状态-绿色
function stopStateClu(){
	Ext.getCmp("clusterControllerState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.backup.pause+"</font></div>");
	Ext.getCmp("clusterConsol").removeCls("consol_1");
	Ext.getCmp("clusterConsol").removeCls("consol_2");
	Ext.getCmp("clusterConsol").removeCls("consol_4");
	Ext.getCmp("clusterConsol").removeCls("consol_5");
	Ext.getCmp("clusterConsol").removeCls("consol_6");
	Ext.getCmp("clusterConsol").addCls("consol_3");
	updateClusterDeviceList();
}

//异常状态-橙色
function excepStateClu(){
	Ext.getCmp("clusterControllerState").update("<div class='font_h4' ><font color='#ffffff'>"+local.backup.clientState+"</font><font  color='#ffff00'>"+local.abnormal+"</font></div>");
	Ext.getCmp("clusterConsol").removeCls("consol_1");
	Ext.getCmp("clusterConsol").removeCls("consol_2");
	Ext.getCmp("clusterConsol").removeCls("consol_3");
	Ext.getCmp("clusterConsol").removeCls("consol_5");
	Ext.getCmp("clusterConsol").removeCls("consol_6");
	Ext.getCmp("clusterConsol").addCls("consol_4");
	updateClusterDeviceList();
}

//运行中状态-绿色
function runStateClu(){
	failureTimes = 0;
	Ext.getCmp("clusterControllerState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.backup.running+"</font></div>");
	Ext.getCmp("clusterConsol").removeCls("consol_1");
	Ext.getCmp("clusterConsol").removeCls("consol_6");
	Ext.getCmp("clusterConsol").removeCls("consol_3");
	Ext.getCmp("clusterConsol").removeCls("consol_4");
	Ext.getCmp("clusterConsol").removeCls("consol_5");
	Ext.getCmp("clusterConsol").addCls("consol_2");
	updateClusterDeviceList();
	if(TM_HANDLE_UPDATE == -1) {
		updateCluster();
		TM_HANDLE_UPDATE = setInterval(updateCluster, 4000);	
	}
}

//未设置状态
function initStateClu(){
	Ext.getCmp("clusterControllerState").update("<div  class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.unconfig+"</font></div>");
	Ext.getCmp("clusterConsol").removeCls("consol_1");
	Ext.getCmp("clusterConsol").removeCls("consol_2");
	Ext.getCmp("clusterConsol").removeCls("consol_3");
	Ext.getCmp("clusterConsol").removeCls("consol_4");
	Ext.getCmp("clusterConsol").removeCls("consol_5");
	Ext.getCmp("clusterConsol").addCls("consol_6");
	Ext.getCmp("clusterBackupconfig").setDisabled(false);
	updateClusterDeviceList();
}


//运行中，轮询该方法
function updateCluster(){
	Ext.Ajax.request({
		url : '/backup/tobackupAction!getClusterProcessState.action',
		params : {
			clusterId:clusterId
		},
		success : function(response, options){
			var obj = Ext.decode(response.responseText);
			if(null != obj){
				var devices = obj.info;
				var store = Ext.getCmp('clusterDeviceList').getStore();
				
				if(null == store.getAt(1)) return;
				
				//判定菜单状态
				var triggle = 0;
				for(var i = 0 ; i< store.count();i++){
					var item = store.getAt(i);
					//console.log(item.get('deviceId'));
					//console.log(JSON.stringify(devices[item.get('deviceId')]));
					var data = devices[item.get('deviceId')];
					if(data == null) 
					{
						continue;
					}
						
					if(data.byRunState == 1&&(data.byEngineWorkState == 2||data.byEngineWorkState == 5)){
						triggle++;
						//有进度的情况
//						console.log("*******************有进度显示*********************");
//						console.log("****************************************");
//						console.log("deviceId==="+item.get('deviceId'));
//						console.log("msg===="+data["szFileSystemDescription"]);
//						console.log("byEngineWorkState===="+data['byEngineWorkState']);
//						console.log("byRunState===="+data['byRunState']);
//						console.log("byProgress===="+data['byProgress']);
//						console.log("dwSpeedKB===="+data['dwSpeedKB']);
							
						item.set("dwSpeedKB",data['dwSpeedKB']);
						item.set("progress",data['byProgress']);
							
						var str =data.byEngineWorkState==2?"全盘镜像中...":"数据校验中...";
						var des = data["szFileSystemDescription"];
						if(des == null){
							item.set("details",str);
						}else{
							item.set("details",des+" "+str);
						}
					}else{
						//无进度的情况
//						console.log("****************************************");
//						console.log("********RunState==="+data.byRunState+"********************");
//						console.log("**********EngineWorkState==="+data.byEngineWorkState+"*********************");
//						console.log("********************无进度********************");
//						console.log("****************************************");
						
						item.set("details","");
						item.set("dwSpeedKB",0);
						item.set("progress",0);
					}
				}
			}else{
				var store = Ext.getCmp('clusterDeviceList').getStore();
				if(null == store.getAt(1)) return;
				for(var i = 0 ; i< store.count();i++){
					var item = store.getAt(i);
					item.set("details","");
					item.set("dwSpeedKB",0);
					item.set("progress",0);
				}
			}
			//菜单状态
			if(triggle>0){
				workState_menu = 2; //镜像中
			}else{
				workState_menu = 6;//无状态
			}
		},
		failure : function() {                                                                                         
			workState_menu = 6;
			failureTimes++;
			if(failureTimes >= 3){//失败三次，轮训停止
				if(TM_HANDLE_UPDATE != -1) {
					clearInterval(TM_HANDLE_UPDATE);
					TM_HANDLE_UPDATE = -1; 
				}
			}
			console.log("Ext_Fail_i=("+failureTimes+")_TM_HANDLE_UPDATE-fail="+TM_HANDLE_UPDATE);
		}
	});
}

//刷新集群控制台
function updateClusterDeviceList(){
  	Ext.getCmp('clusterDeviceList').getStore().load({
		params : {
			clusterId : clusterId
		}
	}); 
}

//清空定时器
function clearTimer(){
	if(TM_HANDLE_UPDATE != -1) {
		clearInterval(TM_HANDLE_UPDATE);
		TM_HANDLE_UPDATE = -1; 
	}
}

