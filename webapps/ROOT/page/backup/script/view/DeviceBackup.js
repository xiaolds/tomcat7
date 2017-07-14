var selectDeviceId = null;
var device_dobuleComputer = 0;
var selectDeviceMac = null;
var diskCloneStatus = 5;//diskClone的初始状态设为未配置
var deviceStatus = null;//设备的状态
var deviceType = null;//设备的类型
var deviceUuid = null;//设备UUID
var deClientSystype = null;
var licenseWarning = null;//授权，预警开关
var TM_HANDLE_UPDATE = -1;//设置备份进度和速度的全局变量
var workState_menu = 6;
var isClusterDevice = null;

/**
 * 定义备份控制台 
 */
Ext.define("websure.backup.view.ConsoPanel", {
	extend : 'Ext.panel.Panel',
	alias : 'widget.consoPanel',
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
		id : 'consol',
		cls : 'consol_1',
		padding : '7 10 0 20',
		bodyStyle : 'background:none',
		defaults : {
			border : false
		},
		items : [{
			width : 300,
			id : 'controllerState',
			padding : '2 10 0 0',
			bodyStyle : 'background:none;',
			html : "<div  class='font_h4'><font color='#ffffff'>"
					+ local.backup.clientState
					+ "</font></div>",
			listeners : {}
		},{
			flex : 1
		}, {
			width : 90,
			xtype : 'button',
			text : local.btn.operate,
			id : 'operateButton',
			bodyStyle : 'background:#555555;',
			icon : '/images/common/arrow_down.png',
			iconAlign : 'right',
			listeners : {
				'click' : showCDPCtrlMenu
			}
		}]
	}, {
		flex : 1,
		layout : 'hbox',
		style : 'border:1px solid #e3eaec;border-top:0;',
		width : '100%',
		items : [{
			html : '<div id="box"></div>',
			width : 200,
			id : 'pri',
			height : '100%',
			border : false,
			style : 'background:#fafbfc;padding-top:15px;border-right:1px solid #eef2f4',
			bodyStyle : 'background:#fafbfc;',
			listeners : {
				afterrender : {
					fn : function() {
						var object = document.getElementById('box');
						var imgLeft = '0px';
						object.style.backgroundPosition = imgLeft + '\t\n'
								+ '0px';
						object.innerHTML = '';
					}}
			}
		}, {
			id : 'controllerInfo',
			html : "",
			flex:1,
			padding : '60 50 0 20',
			border : false
		}]
	}]
});

/**
 * 共享磁盘panel
 */
Ext.define('websure.backup.view.ShowShareDiskTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.showShareDiskTree',
			id : 'showShareDiskTree',
			useArrows : true,
			rootVisible : false,
			border : false,
			style:'border-top:1px solid #DBE0E2;border-bottom:1px solid #DBE0E2',
			width : '100%',
			multiSelect : true,
			disabled : true,
			store : 'shareDiskStore',
			columns : [{
						xtype : 'treecolumn',
						text : local.disk,
						flex : 2.3,
						sortable : true,
						tdCls:"font_bold",
						dataIndex : 'hard_partition_Name'
					},{
						xtype : 'treecolumn',
						text : local.disk,
						flex : 0.9,
						sortable : true,
						dataIndex : 'hardName',
						hidden : true
					}, {
						xtype : 'column',
						text : local.disk+'ID',
						flex : 1.5,
						sortable : true,
						dataIndex : 'hardDiskId',
						hidden : true
					}, {
						xtype : 'column',
						text : local.partition+'ID',
						flex : 1.5,
						sortable : true,
						dataIndex : 'partitionId',
						hidden : true
					}, {
						xtype : 'templatecolumn',
						text : local.backup.diskInfoGridPartionColumn,
						flex : 1,
						dataIndex : 'letter',
						tpl : Ext.create('Ext.XTemplate',
								'{letter:this.formatSize}', {
									formatSize : function(v) {
										var subs = v.replace(":", local.backup.diskInfoGridPartionColumnText);
										return subs;
									}
								}),
						hidden : true
					}, {
						text : local.backup.diskInfoGridSize,
						flex : 1.1,
						sortable : true,
						dataIndex : 'totalSector'
					},  {
						text : local.backup.diskInfoGridBegin,
						flex : 1.1,
						sortable : true,
						dataIndex : 'partitionStartSector'
					},{
						text : local.backup.diskInfoGridFormat,
						flex : 1.1,
						dataIndex : 'fileSystem'
					}, {
						header : local.backup.diskInfoGridState,
						dataIndex : 'runningStatus',
						flex : 1.1,
						renderer : function(v, cellMeta, record, rowIndex, columnIndex, store) {//0 not backup,==1 mirror,==2 finish mirror,==3 mirror error, ==4 checking, ==5 check error
							if ("" != v) {
								if(v == 0){
									return "<img src='/images/common/gray.png'></img>&nbsp;&nbsp;<font style='color:gray'>"+local.backup.diskInfoGridStateNot+"</font>";
								}else if (v == 1) {
									return "<img src='/images/common/green.png'></img>&nbsp;&nbsp;<font style='color:green'>"+local.backup.diskInfoGridStateBeing+"</font>";
								} else if (v == 2) {
									return "<img src='/images/common/green.png'></img>&nbsp;&nbsp;<font style='color:green'>"+local.backup.diskInfoGridStateOver+"</font>";
								} else if(v == 3){
									return "<img src='/images/common/red.png'></img>&nbsp;&nbsp;<font style='color:red'>"+local.backup.diskInfoGridStateFailure+"</font>";
								}else if(v == 4){
									return "<img src='/images/common/green.png'></img>&nbsp;&nbsp;<font style='color:green'>"+local.backup.diskInfoGridCheck+"</font>";
								}else if(v == 5){
									return "<img src='/images/common/red.png'></img>&nbsp;&nbsp;<font style='color:red'>"+local.backup.diskInfoGridCheckError+"</font>";
								}
							} else {
								return "";
							}
					}
				}],
			// height : 400,
			loadMask : {
				msg : local.loading
			}
		});

/**
 * 共享磁盘
 */
Ext.define('websure.backup.view.ShowShareDiskPanel', {
			extend : 'Ext.panel.Panel',
			border : false,
			style:'margin-top:10px;',
			alias : 'widget.showShareDiskPanel',
			id : 'showShareDiskPanel',
			autoScroll : 'auto',
			items : [{
						xtype : 'label',
						id : 'showShareHard',
						style:'display:block',
						html : '<b>'+local.backup.diskShare+'</b>',
						padding:'7 10 7 10'
					}, {
						xtype : 'showShareDiskTree'
					}]
		});

// 定义磁盘信息tree	TODO
Ext.define('websure.backup.view.DiskinfoList', {
	extend : 'Ext.tree.Panel',
	id : 'diskinfoList',
	alias : 'widget.diskinfoList',
	disabled : true,
	border:false,
	cls:"grid_border",
	useArrows : true,
	// 自动刷新状态时不显示小红点
	viewConfig: {
		markDirty: false
	},
	rootVisible : false,
	initComponent : function() {
				var self = this;
				Ext.applyIf(self, 
							{
								store : 'DiskInfoStore',
								columns : [{
								xtype : 'treecolumn',
								text : local.disk,
								flex : 2.3,
								sortable : true,
								tdCls:"font_bold",
								dataIndex : 'hard_partition_Name'
							}, {
								xtype : 'treecolumn',
								text : local.disk,
								flex : 0.9,
								sortable : true,
								tdCls:"font_bold",
								dataIndex : 'hardName',
								hidden : true
							}, {
								xtype : 'column',
								text :local.disk+ 'ID',
								flex : 1.5,
								sortable : true,
								dataIndex : 'hardDiskId',
								hidden : true
							}, {
								xtype : 'column',
								text :local.partition+ 'ID',
								flex : 1.5,
								sortable : true,
								dataIndex : 'partitionId',
								hidden : true
							},{
								text : local.backup.mountInfoDot,
								flex : 0.9,
								tdCls:"font_color_999",
								dataIndex : 'mountInfo'
							}, {
								xtype : 'templatecolumn',
								text : local.backup.diskInfoGridPartionColumn,
								flex : 1,
								dataIndex : 'letter',
								tpl : Ext.create('Ext.XTemplate', '{letter:this.formatSize}', {
											formatSize : function(v) {
												var subs = v.replace(":", local.backup.diskInfoGridPartionColumnText);
												return subs;
											}
										}),
								hidden : true
							}, {
								text : local.backup.diskInfoGridSize,
								flex : 1.1,
								tdCls:"font_color_999",
								sortable : true,
								dataIndex : 'totalSector'
							},  {
								text : local.backup.diskInfoGridBegin,
								flex : 1.1,
								sortable : true,
								tdCls:"font_color_999",
								dataIndex : 'partitionStartSector'
							}, {
								text : local.backup.diskInfoGridFormat,
								flex : 1.1,
								tdCls:"font_color_999",
								dataIndex : 'fileSystem'
							}, {
								header : local.backup.diskInfoGridState,
								dataIndex : 'runningStatus',
								flex : 1.1,
								renderer : function(v, m, r) {//0 not backup,==1 mirror,==2 finish mirror,==3 mirror error, ==4 checking, ==5 check error
									if("LVM2_member" != r.get('fileSystem')){
										if ("" != v) {
											if(v == 0){
												return "<img src='/images/common/gray.png'></img>&nbsp;&nbsp;<font style='color:gray'>"+local.backup.diskInfoGridStateNot+"</font>";
											}else if (v == 1) {
												return "<img src='/images/common/green.png'></img>&nbsp;&nbsp;<font style='color:green'>"+local.backup.diskInfoGridStateBeing+"</font>";
											} else if (v == 2) {
												return "<img src='/images/common/green.png'></img>&nbsp;&nbsp;<font style='color:green'>"+local.backup.diskInfoGridStateOver+"</font>";
											} else if(v == 3){
												return "<img src='/images/common/red.png'></img>&nbsp;&nbsp;<font style='color:red'>"+local.backup.diskInfoGridStateFailure+"</font>";
											}else if(v == 4){
												return "<img src='/images/common/green.png'></img>&nbsp;&nbsp;<font style='color:green'>"+local.backup.diskInfoGridCheck+"</font>";
											}else if(v == 5){
												return "<img src='/images/common/red.png'></img>&nbsp;&nbsp;<font style='color:red'>"+local.backup.diskInfoGridCheckError+"</font>";
											}
										} else {
											return "";
										}
									}else{
										return "";
									}
								}
							}]
						});
				self.callParent(arguments);
			},
	loadMask : {
		msg : local.loading
	},
	listeners:{
		"afterrender" : function(node,eOpts){
			var grid = Ext.getCmp("diskinfoList");
			if(null != deClientSystype){	// 操作系统种类
				if(0 <= deClientSystype && deClientSystype <= 28){	//TODO
					grid.columns[4].hide();
				}else{
					grid.columns[4].show();
				}
			}
		},
		'beforeload':function(store, operation){
//               this.getRootNode().hide();
		}
	}
	
});

// 磁盘信息
Ext.define('websure.backup.view.DiskinfoPanel', {
			extend : 'Ext.panel.Panel',
			id : 'diskinfoPanel',
			border : false,
			alias : 'widget.diskinfoPanel',
			overflowY:"auto",
			items : [{
						xtype : 'diskinfoList'
					}, {
						xtype : 'panel',
						border : false,
						id : 'showShareHardDisk'
					}]

		});

// 备份策略
Ext.define('websure.backup.view.backupStrategy', {
            extend : 'Ext.grid.Panel',
			alias : 'widget.backupStrategy',
			id : 'backupStrategyId',
			store : 'StrategyInfoStore',
            //height: 400,
            border:false,
            bodyBorder:false,
            hideHeaders : true,
            overflowY:"auto",
            width:"100%",
            columns: [                    
                      { header: local.name, width: 140,dataIndex: 'showName', align: 'left'},    //统一左对齐，配置页面是左对齐
                      { header: local.content, width: "50%",tdCls:"font_color_999", dataIndex: 'showContent'},
                      { header: local.emergency.gridHander, flex:1, dataIndex:'op',align:'right'} 
                     ],
	         loadMask:{
		      msg:local.loading
		    },
		    listeners:{
		    	'afterrender':function(v){
		    		
		    	}
		    	
		    }
        });
        
// 设备日志
Ext.define('websure.backup.view.deviceLog', {
            extend : 'Ext.grid.Panel',
			alias : 'widget.deviceLog',
			id : 'deviceLog',
			store : 'DeviceLogStore',
            //height: 300,
            width:"100%",
            enableColumnResize:false,
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
                      { header: local.log.gridTime,menuDisabled:true, tdCls:"font_color_999",width:150,dataIndex: 'diskCloneLogCreateTimeForPage'/*, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')*/
                      				/*renderer:  function(value) {
									    var dateObj= new Date(value);
									    return dateObj.format('Y-m-d H:i:s');
									} */
					  },
                      { header: local.content,flex:4, tdCls:"font_color_999",dataIndex:'diskCloneLogContent', 
						renderer: function(value,metaData,record,colIndex,store,view) {
   	        		   return  '<div title="' + value + '">' + value + '</div>';
   	        	   }} 
                     ],
	         loadMask:{
		      msg:local.loading
		    },
		    dockedItems : [{
							xtype : 'pagingtoolbar',
							store : 'DeviceLogStore', // same store GridPanel is using
							dock : 'bottom', 
							emptyMsg : local.backup.dataEmpty,
							displayInfo : true,
							displayMsg : local.toolbarDisplayMsg,
							beforePageText : local.toolbarBeforePageText,
							afterPageText : local.toolbarAfterPageText,
							listeners : {  
				                      beforechange : function(obj, pdata, options) {
				                      	
				                      		var store = Ext.getCmp('deviceLog').store;
				                      	    store.on("beforeload",function(){
												Ext.apply(store.proxy.extraParams, {deviceId : selectDeviceId});
											});
					                  },
					                  beforerender: function(){
					                	  // 每次出现的时候加载第一页
					                	  var store = Ext.getCmp('deviceLog').store;
					                	  store.loadPage(1);
					                  }
					            }
							} 
						  ]
        });

// 定义备份详情tab页
Ext.define('websure.backup.view.DetailPanel', {
			extend : 'Ext.tab.Panel',
			alias : 'widget.detailtabPanel',
			id:'detailtabPanel',
			plain : true,
			enableTabScroll : true,
			bodyStyle : 'background:#fff;border-color:#e3eaec;',
			resizeTabs : true,
			cls : 'tab_s tab_1',
			activeTab : 0,
			width : '100%',
			//margin : '10 0 0 0',
			items : [{
						title : local.backup.tabDiskinfo,	//TODO
						itemId : '1',
						xtype : "diskinfoPanel",
						id:'diskInfoPanelId'
					}, {
						title : local.backup.tabBackupStrategy,
//						id:"tabBackupStrategyId",
						itemId : '2',
						xtype : "backupStrategy",
						listeners : {
							afterrender : function(v){
//								POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v,CURRENT_USER.getBackupPower());
							}
						}
					}, {
						title : local.backup.tabLog,
						itemId : '3',
						xtype : "deviceLog"
					}],
			listeners : {
				'tabchange' : function(tabPanel, newCard, oldCard) {
					var itemi = tabPanel.activeTab.itemId;
					if (2 == itemi) {
//						console.debug("tabBackupStrategyId", Ext.getCmp("tabBackupStrategyId"));
						// 备份策略详情
						Ext.getCmp("backupStrategyId").store.load({
							params : {
								deviceId : selectDeviceId
							},
							callback : function(){
								POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs("backupStrategyId",CURRENT_USER.getBackupPower());
							}
						});
						
					} else if (3 == itemi) {
						//设备操作日志
						Ext.getCmp("deviceLog").store.load({
						params : {
							deviceId : selectDeviceId
						}
					});
					}
				}
			}
		});

// 备份tab页
Ext.define('websure.backup.view.BackupTab', {
			extend : 'Ext.panel.Panel',
			border : false,
			alias : 'widget.backupTab',
			style : 'background:#fff;',
			//autoScroll : true,
			overflowY:"auto",
			height:"100%",
			//padding : 20,
			layout : 'vbox',
			items : [{
				xtype : 'label',
				padding:"20 20 0 20",
				id : 'labelConsole',
				html : "<font class='font_t'>"+local.backup.titleControl+"</font>",
				width : '90%'
			}, {
				xtype : 'consoPanel',
				height : 220,
				margin : '10 20 20 20',
				listener : {

				}
			}, {
				xtype : 'label',
				id : 'labeldetail',
				padding:"0 20 0 20",
				html : "<font class='font_t'>"+local.backup.titleInfo+"</font>",
				width : '100%'
			}, {
				padding:"10 20 20 20",
				height:430,
				xtype : 'detailtabPanel'
			}]
		});

// 定义tab页
Ext.define('websure.backup.view.TabPanel', {
			extend : 'Ext.tab.Panel',
			alias : 'widget.tabPanel',
			id : 'tabPanel',
			plain : true,
			enableTabScroll : true,
			style : 'background:#fafbfc;',
			bodyStyle : 'background:#fafbfc;border:0;border-top:1px solid #d1dade',
			resizeTabs : true,
			cls : 'tab_big',
			activeTab : 0,
			items : [],
			listeners:{
				afterrender:function(){
					Ext.getCmp("tabPanel").setActiveTab(0);
					}
			}
		});

Ext.define("websure.backup.view.DeviceBackup", {	//TODO deviceBackup
	extend : 'Ext.panel.Panel',
	alias : 'widget.DeviceBackup',
	id : 'DeviceBackup',
	border : false,
	//width:"100%",
	//overflowY:"auto",
	layout:"vbox",
	items : [{
		xtype : "panel",
		id : 'topPanel',
		width : '100%',
		bodyStyle : 'background:#fafbfc;',
		height : 146,
		border : false,
		items : [{
			xtype : "panel",
			border : false,
			layout : 'column',
			bodyStyle : 'background:#fafbfc;',
			items : [{
						xtype : "panel",
						width : 400,
						id : 'deviceDetailInfo',
						border : false,
						padding : 25,
						bodyStyle : 'background:#fafbfc;',
						html : ""
					}, {
					    xtype : 'panel', 
					    columnWidth : 1,
						border : false,
						layout:"vbox",
						bodyStyle : 'background:#fafbfc;',
						items : [{
                            xtype : 'label',
                            id : 'sysinfo',
                            border : false,
                            width:"100%",
                            padding : '25 0 10 25',
                            style : 'color:#999;',
                            html : ''
                        },{
						    xtype : 'panel',
						    width:'100%',
                            id : 'upgradePanel',
                            border:false,
                            padding:'0 0 0 25',
                            bodyStyle : 'background:#fafbfc;',
                            items :[{
                            	xtype : 'label',
                                id : 'newVersion',
                                border : false,
                                html : ''
                            },{
                                xtype : 'button',
                                id : 'upgradeBtn',
                                margin:'0 0 0 10',
                                width : 118,
                                disabled : true,
                                hidden:true,
                                text : '升级',
                                listeners: {
                                    click: function(me,e,opt) {
                                    	upgradeClient(me,e,opt);
                                    }}
                            }],
                            listeners : {
                             afterrender : function(v,eOpts) {
                             	//检测客户端版本更新
                                //checkClientUpgrade();
                                }
                            }
						}]
					}, {
						width:300,
						padding : '54 30 30 30',
						border : false,
						bodyStyle : 'background:#fafbfc;',
						items : [{
							xtype : 'button',
							id : 'backupconfig',
							itemId:'backup_device_config',
							width : 118,
							type:'1',
							height : 35,
							cls : 'btn_big',
							style : 'padding-left:22px;background:#0aa;border-color:#099;float:right',
							icon : '/images/common/set.png',
							text : local.btn.backupConfig
						},{
							xtype : 'button',
							id : 'warningconfig',
							itemId : 'backup_device_warningconfig',
							width : 118,
							height : 35,
							type:'2',
							cls : 'btn_big',
							style : 'padding-left:22px;background:#0aa;border-color:#099;float:right',
							icon : '/images/common/set.png',
							hidden : true,
							text : local.backup.diskWarnConfig,
							disabled : true
						},{
							xtype : 'button',
							id : 'backup_db_config',
//							itemId : 'backup_device_db_backup_config',
							width : 118,
							height : 35,
							type:'3',
							cls : 'btn_big',
							style : 'padding-left:22px;background:#0aa;border-color:#099;float:right',
							icon : '/images/common/set.png',
							hidden : true,
							text : local.backup.creatTask
						}]
					},{
						xtype : "panel",
						id : 'shrink',
						border : false,
						width : 56,
						html : "<div class='shrink' onclick='fadeoutAll();'><img id='backImg' src='/images/backup/shrink.png' /></div>"
					}]

		}]
	}, {
		style : 'margin-top:-38px',
		width:"100%",
		flex:1,
		xtype : 'tabPanel'
	}],
	listeners : {
		afterrender : function(v,eOpts) {
			deviceType = this.deviceType;
			deviceStatus = this.deStatus;//加载设备是否在线状态
			// 加载备份控制台的磁盘信息
			selectDeviceId = this.deId;
			selectDeviceMac = this.deMac;
			deviceUuid = this.deuuid;
			device_dobuleComputer = this.deIsStandby;//1:表示双机  2：表示非双机
			licenseWarning = this.licenseWarning;//授权，预警开关 1:已授权  0：未授权
			deClientSystype = this.deClientSystype;//设备操作系统类型
			isClusterDevice = this.isClusterDevice;
			if(TM_HANDLE_UPDATE != -1) {
				clearInterval(TM_HANDLE_UPDATE);
				TM_HANDLE_UPDATE = -1; 
			}
			
			Ext.getCmp("deviceDetailInfo")	//TODO
					.update("<div><img style='display:block;float:left' src='/images/backup/"+this.deviceIco+"'></img><div style='float:left;margin-left:4px;'><font class='font_h3'>"
								+ this.deText
								+ "</font></br>"
								+ this.deIp
								+ "</div></div>");
			Ext.getCmp("sysinfo").update(local.systemInfo + ":"+ (null == this.deSysVer?"": this.deSysVer) + "<br/>" + local.version + ":" + (null == this.deCliVersion?"": this.deCliVersion) + "");
			
			//版本更新检查
			//checkClientUpgrade();
			//获取设备对应的模块
			Ext.Ajax.request({
					url : '/backup/todeviceAction!geteReportDeviceModeInfo.action',
					params : {
						deviceId : selectDeviceId
					},
					async: false,
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
							var  dynamicTabPanel = Ext.getCmp("tabPanel");
							//判断模块表中是否有模块信息，有->按照模块表中信息add tab  没有->1、判断是否type为1（上报设备）  如果是->显示磁盘备份、预警     如果不是->显示空的
							if(null != obj.info){//模块表中有信息
								//返回值：123（类似）
								if("" == obj.info){//模块表中没有信息
									if(1 == deviceType || 2 == deviceType){//是上报设备
										dynamicTabPanel.removeAll(); 
										dynamicTabPanel.add({
											title : local.backup.gridDiscBackup,
											xtype : "backupTab",
											id:"1",
											listeners : {
												'activate':function(){
													Ext.getCmp("backupconfig").setText(local.btn.backupConfig);
													Ext.getCmp("warningconfig").hide();
													Ext.getCmp("backup_db_config").hide();
													Ext.getCmp("backupconfig").show();
												},
												'afterrender':function(){
													dynamicTabPanel.setActiveTab(0);
												}
										
											}
										});
										//授权，预警开关
										if(licenseWarning == 0){
											dynamicTabPanel.add({
												title : local.backup.tabTitleWarn,
												xtype : "licenseForeWarningView",
												listeners : {
													'activate':function(){
														Ext.getCmp("warningconfig").show();
														Ext.getCmp("warningconfig").setDisabled(true);
														Ext.getCmp("backupconfig").hide();
														Ext.getCmp("backup_db_config").hide();
													}
												}
											});
											Ext.getCmp("licenseForeWarningViewId").update(local.log.authTips);
										}else{
											dynamicTabPanel.add({
												title : local.backup.tabTitleWarn,
												xtype : "ForeWarningTab",
												id:"2",
												listeners : {
													'activate':function(){
														Ext.getCmp("warningconfig").show();
														Ext.getCmp("backupconfig").hide();
														Ext.getCmp("backup_db_config").hide();
													}
												}
											});
										}
										dynamicTabPanel.doLayout();
								
									}else{//手动创建设备
										dynamicTabPanel.removeAll();
										Ext.getCmp("backupconfig").hide();
										dynamicTabPanel.doLayout();
									}
								}else{//模块表中有信息
									dynamicTabPanel.removeAll(); 
									
									var s = obj.info.split("");
									if(s.length>0){
										for(var i=0;i<s.length;i++){
											if(1 == s[i]){
												dynamicTabPanel.add({
													title : local.backup.gridDiscBackup,
													xtype : "backupTab",
													id:"1",
													listeners : {
														'activate':function(){
															Ext.getCmp("backupconfig").show();
															Ext.getCmp("warningconfig").hide();
															Ext.getCmp("backup_db_config").hide();	//TODO
														},
														'afterrender':function(){
															dynamicTabPanel.setActiveTab(0);
														}
													}
												});
											}else if(2 == s[i]){
												//授权，预警开关
												if(licenseWarning == 0){
													dynamicTabPanel.add({
														title : local.backup.tabTitleWarn,
														xtype : "licenseForeWarningView",
														listeners : {
															'activate':function(){
																Ext.getCmp("warningconfig").show();
																Ext.getCmp("warningconfig").setDisabled(true);
																Ext.getCmp("backupconfig").hide();
																Ext.getCmp("backup_db_config").hide();
															}
														}
													});
													Ext.getCmp("licenseForeWarningViewId").update(local.log.authTips);
												}else{
													dynamicTabPanel.add({
														title : local.backup.tabTitleWarn,
														xtype : "ForeWarningTab",
														id:"2",
														listeners : {
															'activate':function(){
																Ext.getCmp("warningconfig").show();
																Ext.getCmp("backupconfig").hide();
																Ext.getCmp("backup_db_config").hide();
															}
														}
													});
												}
												
											}else if(3 == s[i]){
												dynamicTabPanel.add({
													title : local.config.DB,
													border:false,
													bodyBorder:false,
													xtype : "ExtraDeviceMode",
													id:"3",
													listeners : {
														'afterrender':function(){
															Ext.getCmp("backupconfig").hide();
															Ext.getCmp("warningconfig").hide();
															Ext.getCmp("backup_db_config").show();
															
														},
														'activate':function(){
															Ext.getCmp("backup_db_config").show();
															Ext.getCmp("warningconfig").hide();
															Ext.getCmp("backupconfig").hide();
														}
													}
												});
											}
										}
									}
									dynamicTabPanel.setActiveTab(0);
									dynamicTabPanel.doLayout();
								
								}
							}else{//模块表中没有信息
								
							}
							
						if(typeof(Ext.getCmp('3')) != "undefined"){
							Ext.getCmp("taskInfoList").store.load({
								params : {
									deviceId : selectDeviceId
								}
							});
						}
						
						/*if(typeof(Ext.getCmp('4')) != "undefined"){
							Ext.getCmp("taskInfoList").store.load({
								params : {
									deviceId : selectDeviceId
								}
							});
						}*/
							
							
					if(typeof(Ext.getCmp('1')) != "undefined"){
						
						//防止磁盘列表会重复列出磁盘信息
							var store_disk = Ext.getCmp("diskinfoList").getStore(); 
							if(null != store_disk){
								store_disk.getRootNode().removeAll(false);//清空数据
							}
							store_disk.setProxy({
					            type: 'ajax',  
					            url: '/backup/todeviceAction!getDeviceomtrollerInfo.action',	//TODO
					            params:{
					            	isCluster:isClusterDevice
					            },
//					            async: false,
					            reader : {
									type : 'json',
									root: 'children'
								},
								beforeload: function (store, operation, eOpts) {
									if(store.isLoading()) return false;
								} 
					        });
							
							if(!store_disk.isLoading()){
								store_disk.load({
									params : {
										deviceId : selectDeviceId,
										isCluster:isClusterDevice	// 是否为集群机器
									}
							});

						 if(!store_disk.isLoading()){
									store_disk.load({
										params : {
											deviceId : selectDeviceId
										}
									});
								}
//							}
							
							// 备份控制台
							Ext.Ajax.request({
								url : '/backup/tobackupAction!getDiskCloneByDeviceId.action',
//								async: false,
								params : {
									deviceId : selectDeviceId
								},
								success : function(response, options) {
									var obj = Ext.decode(response.responseText);
									if (null != obj.detail) {
										diskCloneState = obj.detail.state;
										diskCloneStatus = diskCloneState;
										if(1 == deviceStatus){//设备处于在线状态
											//diskClone状态
											//1.运行2.暂停3.异常4.主备切换中（客户端做主备切换的时候，消息服务器判断状态未是否为Reset状态未，如果是Reset则需要拒绝此次主备切换操作。）5.未配置
											
											//1不在线-灰色#ccc 2运行-绿色#68ba8a 3 暂停-绿色#68ba8a 4异常-红色#f75a53 5 reset-蓝色 #3a7ea5 6 未配置-黄色 #abad23
											if (5 == diskCloneState) {// 5 未配置
												initState();
												
											} else if(2 == diskCloneState) {// 2 暂停
												stopState();
												
											}else if(1 == diskCloneState) {// 1 运行
												runState(obj.detail.workState);
												
											}else if(4 == diskCloneState){//4 主备切换中
												switchState();
											
											}else {// 3 异常
												excepState();
												
											} 
											if(1 == isClusterDevice){
												Ext.getCmp("backupconfig").setDisabled(true);
												//禁止掉集群单机配置TAB
												Ext.getCmp("detailtabPanel").remove(Ext.getCmp("backupStrategyId"));
												
											}else{
												//如果是运行状态，配置按钮disabled
												if(1 == diskCloneState){
													Ext.getCmp("backupconfig").setDisabled(true);
												}else{
													Ext.getCmp("backupconfig").setDisabled(false);
												}
											}
											
										}else if(2 == deviceStatus){//设备处于非在线状态（不在线和异常）
											Ext.getCmp("backupconfig").setDisabled(true);
											unOnlineState();
										}else{
											Ext.getCmp("backupconfig").setDisabled(true);
											excepState();
										}
								}else{
									excepState();
								}
								
								POWER_OP.filterEnableWidgetsOfExtjs(v,CURRENT_USER.getBackupPower());	
								},
								failure : function() {
//									Ext.MessageBox.alert(local.window.tip, local.backup.getDiskCloneFailure);
									Ext.websure.MsgError("WF-30019", local.backup.getDiskCloneFailure);
								}
							});
				
							if(1 == device_dobuleComputer){
								// 备份详情
								Ext.Ajax.request({
										url : '/backup/todeviceAction!checkShareHardForShow.action',
										params : {
											parId : selectDeviceId
										},
//										async: false,
										success : function(response, options) {
											var obj = Ext.decode(response.responseText);
											if ("no" != obj.msg) {
												var shareHardDiskPanel = Ext.getCmp('showShareHardDisk');
												shareHardDiskPanel.removeAll();
												shareHardDiskPanel.add({
															xtype : 'showShareDiskPanel'
														});
												shareHardDiskPanel.doLayout();
				
												Ext.getCmp("showShareHard")
														.update("<b>"+local.backup.diskShare+"</b>("+local.backup.deviceShare+"："
																+ obj.msg.split(":")[1]
																+ ")</br>");
												// 查询共享磁盘的数据
												Ext.getCmp("showShareDiskTree").store.load({
															params : {
																deviceId : obj.msg.split(":")[0]
															}
														});
											} else {
											}
										},
										failure : function() {
//											Ext.MessageBox.alert(local.window.tip, local.backup.shareDiskCloneFailure);
											Ext.websure.MsgError("WF-30020", local.backup.shareDiskCloneFailure);
										}
									});
							}
						}

					}
					},
					failure : function() {
						Ext.websure.MsgError("WF-30021",local.backup.getDeviceFailure);
					}
			});
//			myEvent.hide();//TODO
		}
	}
});

/*
 * function toBackupconfig(){ var win = Ext.create("Ext.window.Window", { title:
 * "配置 WIN-RS4I7TKSI1U [192.168.1.110]", //标题 draggable: false, height: 600,
 * //高度 width: 800, //宽度 id:'configWindow', layout: "fit", //窗口布局类型 modal: true,
 * //是否模态窗口，默认为false resizable: false, items: [{ xtype:'BackupConfigshow' }] });
 * win.show(); }
 */
/**
 * 
 * 淡出
 * 
 */

function fadeoutAll() {

	// 设定最后不透明度为 0.0( 完全透明 ), 持续时间为 1.0 ，方式为 easeNone
	/*
	 * Ext.get ('DeviceBackup').slideOut('bl', { easing: 'easeOut', duration:
	 * 5.0 ,// 事件完成时间（以秒为单位） remove: false, useDisplay: false
	 * //隐藏元素是否使用display或visibility属性? });
	 */
// 	Ext.get('backImg').setOpacity(0.0, { duration:4.0,easing:'easeNone'});  
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
	clusterId = null;
	
	//清除首页左侧树的选中按钮
	var _len = Ext.getCmp("grobleTreePanel").getSelectionModel().getSelection().length;
	if(_len>0){
		Ext.getCmp("grobleTreePanel").getSelectionModel().clearSelections();
		Ext.getCmp("refresh_tree").fireEvent('click');
	}
}

function setBackupConfig() {
	if(!Ext.getCmp('backupconfig').disabled){
		Ext.getCmp('backupconfig').fireEvent('click');
	}
}

//备份策略设置
function setStrategy(type){
	var btn = Ext.getCmp('backupconfig') == null ? Ext.getCmp('clusterBackupconfig') : Ext.getCmp('backupconfig');
	if(!btn.disabled){
		btn.fireEvent('click');
		
		var d = new Ext.util.DelayedTask(function(){  
	       if(2 == type){
				Ext.getCmp("configdatasoure").hide();
				Ext.getCmp("configStrategy").show();
				Ext.getCmp("snapStrategy").hide();
				currentPanel = 2;
				Ext.getCmp("preButton").enable();
				Ext.getCmp("nextButton").enable();
				
				var tree = Ext.getCmp('configTree');
				var record = tree.getStore().getNodeById('2');
				tree.getSelectionModel().select(record);
			}else if(3 == type){
				Ext.getCmp("configdatasoure").hide();
				Ext.getCmp("configStrategy").hide();
				Ext.getCmp("snapStrategy").show();
				currentPanel = 3;
				Ext.getCmp("preButton").enable();
				Ext.getCmp("nextButton").disable();
				
				var tree = Ext.getCmp('configTree');
				var record = tree.getStore().getNodeById('3');
				tree.getSelectionModel().select(record);
			}
	      });  
	      d.delay(700);  
	}else{
		if(1 == isClusterDevice){
			Ext.MessageBox.alert(local.window.tip, local.backup.clusterDeviceCannotOperate);
		}else{
			if(2 == deviceStatus){
				Ext.MessageBox.alert(local.window.tip, local.backup.deviceOfflineNoCannotBackup);
			}else if(1 != diskCloneState){
				Ext.MessageBox.alert(local.window.tip, local.backup.userNoBackupAuth);
			}else{
				Ext.MessageBox.alert(local.window.tip, local.backup.configDiskCloneFailure);
			}
		}
		
	}
}

/**
 * 定义操作菜单
 */
Ext.define('websure.backup.view.OperateMenu', {
		extend : 'Ext.menu.Menu',
		id : 'CDPCtrlMenu',
		style : {
			overflow : 'visible'
		},
		items : [{
					text : local.btn.start,
					id : "startMenuItem",
					itemId:'backup_device_start',
					listeners : {
						click : startMenu
					}
				}, {
					text : local.btn.stop,
					id : "suppendMenuItem",
					itemId:'backup_device_stop',
					listeners : {
					  click:stopMenu
					}
				}, '-', {
					text : local.backup.imeRun,
					id : "imediateRunServerMenuItem",
					itemId:'backup_device_syncnow',
					listeners : {
					  click:imediateRunServerMenu
					  }
				}, {
					text : local.backup.imeSnap,
					itemId:'backup_device_snapshotnow',
					id : "imediateSnapMenuItem",
					listeners : {
					  click:imediateSnapMenu
					 }
				}, {
					text : local.backup.checkData,
					itemId:'backup_device_checkdata',
					id : "checkdataMenuItem",
					listeners : {
					 click:checkdataMenu
					 }
				}, '-', {
					text : local.backup.configInit,
					itemId:'backup_device_configinit',
					id : "initMenuItem",
					listeners : {
						click:initMenu
					}
			}]
});
var cdapMenu = Ext.create("websure.backup.view.OperateMenu");

// 显示操作下拉菜单
function showCDPCtrlMenu(button, e) {
	//判断设备是否在线
	if(1 == deviceStatus){
		//获取diskClone状态信息
		Ext.Ajax.request({
			url : '/backup/tobackupAction!getDiskCloneState.action',
			params : {
				deviceId : selectDeviceId
			},
			success : function(response, options) {
				var obj = Ext.decode(response.responseText);
				console.log("diskClone状态-"+diskCloneStatus+"获取的状态-"+obj.msg)
				
				if(1 == isClusterDevice){
					Ext.getCmp('startMenuItem').setDisabled(true);
					Ext.getCmp('suppendMenuItem').setDisabled(true);
					Ext.getCmp('imediateRunServerMenuItem').setDisabled(true);
					Ext.getCmp('imediateSnapMenuItem').setDisabled(true);
					Ext.getCmp('checkdataMenuItem').setDisabled(true);
					Ext.getCmp('initMenuItem').setDisabled(true);
				}else{
				
					if(diskCloneStatus != obj.msg){
						diskCloneStatus = obj.msg;
						diskCloneState = diskCloneStatus;
						if (5 == diskCloneStatus) {// 5 未配置
							initState();
							
						} else if(2 == diskCloneStatus) {// 2 暂停
							stopState();
							
						}else if(1 == diskCloneStatus) {// 1 运行
							runState(6);
							
						}else if(4 == diskCloneStatus){//4 主备切换中
							switchState();
						
						}else {// 3 异常
							excepState();
							
						} 
						//如果是运行状态，配置按钮disabled
						if(1 == diskCloneState){
							Ext.getCmp("backupconfig").setDisabled(true);
						}else{
							Ext.getCmp("backupconfig").setDisabled(false);
						}
					}
					
					//根据diskClone状态来显示相应的菜单
					//diskClone状态
					//1.运行2.暂停3.异常4.主备切换中5.未配置
					if(2 == diskCloneStatus){//暂停
						Ext.getCmp('startMenuItem').setDisabled(false);
						Ext.getCmp('suppendMenuItem').setDisabled(true);
						Ext.getCmp('imediateRunServerMenuItem').setDisabled(true);
						Ext.getCmp('imediateSnapMenuItem').setDisabled(true);
						Ext.getCmp('checkdataMenuItem').setDisabled(true);
						Ext.getCmp('initMenuItem').setDisabled(false);
						
					}else if(5 == diskCloneStatus){//未配置
						Ext.getCmp('startMenuItem').setDisabled(true);
						Ext.getCmp('suppendMenuItem').setDisabled(true);
						Ext.getCmp('imediateRunServerMenuItem').setDisabled(true);
						Ext.getCmp('imediateSnapMenuItem').setDisabled(true);
						Ext.getCmp('checkdataMenuItem').setDisabled(true);
						Ext.getCmp('initMenuItem').setDisabled(false);
						
					}else if(1 == diskCloneStatus){//运行中，启动状态
						if(workState_menu == 6){
							Ext.getCmp('startMenuItem').setDisabled(true);
							
							Ext.getCmp('suppendMenuItem').setDisabled(false);
							Ext.getCmp('imediateRunServerMenuItem').setDisabled(false);
							Ext.getCmp('imediateSnapMenuItem').setDisabled(false);
							Ext.getCmp('checkdataMenuItem').setDisabled(false);
							Ext.getCmp('initMenuItem').setDisabled(false);
						}else{
							Ext.getCmp('startMenuItem').setDisabled(true);
						
							Ext.getCmp('suppendMenuItem').setDisabled(false);
							Ext.getCmp('imediateRunServerMenuItem').setDisabled(true);
							Ext.getCmp('imediateSnapMenuItem').setDisabled(true);
							Ext.getCmp('checkdataMenuItem').setDisabled(true);
							Ext.getCmp('initMenuItem').setDisabled(true);
						}
						
						
					}else if(4 == diskCloneStatus){//reset状态值
						Ext.getCmp('startMenuItem').setDisabled(true);
						Ext.getCmp('suppendMenuItem').setDisabled(true);
						Ext.getCmp('imediateRunServerMenuItem').setDisabled(true);
						Ext.getCmp('imediateSnapMenuItem').setDisabled(true);
						Ext.getCmp('checkdataMenuItem').setDisabled(true);
						Ext.getCmp('initMenuItem').setDisabled(true);
					}else{//异常
						Ext.getCmp('startMenuItem').setDisabled(true);
						Ext.getCmp('suppendMenuItem').setDisabled(true);
						Ext.getCmp('imediateRunServerMenuItem').setDisabled(true);
						Ext.getCmp('imediateSnapMenuItem').setDisabled(true);
						Ext.getCmp('checkdataMenuItem').setDisabled(true);
						Ext.getCmp('initMenuItem').setDisabled(false);
					}
				}
				POWER_OP.filterEnableMenuOfExtjs(cdapMenu,CURRENT_USER.getBackupPower());
				cdapMenu.showBy(button);
				
			},
			failure : function() {
//				Ext.MessageBox.alert(local.window.tip, local.backup.seekDiskCloneStateFailue);
				Ext.websure.MsgError("WF-30022", local.backup.seekDiskCloneStateFailue);
			}
		});
	}else{
		Ext.getCmp('startMenuItem').setDisabled(true);
		Ext.getCmp('suppendMenuItem').setDisabled(true);
		Ext.getCmp('imediateRunServerMenuItem').setDisabled(true);
		Ext.getCmp('imediateSnapMenuItem').setDisabled(true);
		Ext.getCmp('checkdataMenuItem').setDisabled(true);
		Ext.getCmp('initMenuItem').setDisabled(true);
		
		POWER_OP.filterEnableMenuOfExtjs(cdapMenu,CURRENT_USER.getBackupPower());
		cdapMenu.showBy(button);
		
	}
	
}

/**
 * 启动备份
 */
function startMenu(){
		if(deviceStatus == 2) {
			Ext.MessageBox.alert(local.window.tip, local.backup.deviceOffline);
			return;
		}else {
			startClone();
		}
}


function startClone() {
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.startMsg});
	myMask.show();
	//启动备份
	Ext.Ajax.request({
				url : '/backup/tobackupAction!startDiskClone.action',
				params : {
					selectDeviceMac : selectDeviceMac,
					deviceUuid:deviceUuid,
					deviceId : selectDeviceId
				},
				success : function(response, options) {
					
					var obj=Ext.decode(response.responseText);
					console.log(obj);
					var code = obj.msgCode;
					var content = obj.msgContent;
					if(MSG_NORMAL==code){
						Ext.websure.MsgTip.msg(local.window.tip, content, true);
						runState();
						diskCloneStatus = 1;
						if(1 == diskCloneStatus){
							Ext.getCmp("backupconfig").setDisabled(true);
						}else{
							Ext.getCmp("backupconfig").setDisabled(false);
						}
						
					}else{
						Ext.websure.MsgError(code, content);
					}
					myMask.hide();
				},
				failure : function() {
//					Ext.MessageBox.alert(local.window.tip, local.backup.deviceSnapFailure);
					Ext.websure.MsgError("WF-30023", local.backup.deviceSnapFailure);
					myMask.hide();
				}
			});
}

/**
 * 停止备份
*/
function stopMenu(){
	if(deviceStatus == 2){
		Ext.MessageBox.alert(local.window.tip, local.backup.deviceOffline);
		return;
	}else{ 
		stopClone();
	} 
	
};

function stopClone() {
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.stopMsg});
	myMask.show();
	
	//停止备份
	Ext.Ajax.request({
		url : '/backup/tobackupAction!stopDiskClone.action',
		params : {
			selectDeviceMac : selectDeviceMac,
			deviceUuid:deviceUuid,
			deviceId : selectDeviceId
		},
		success : function(response, options) {
			
			var obj=Ext.decode(response.responseText);
			console.log(obj);
			var code = obj.msgCode;
			var content = obj.msgContent;
			if(MSG_NORMAL==code){
				//设置定时器
				if(TM_HANDLE_UPDATE != -1) {
					clearInterval(TM_HANDLE_UPDATE);
					TM_HANDLE_UPDATE = -1; 
				}
				Ext.websure.MsgTip.msg(local.window.tip, content, true);
				diskCloneStatus = 2;
				if(1 == diskCloneStatus){
					Ext.getCmp("backupconfig").setDisabled(true);
				}else{
					Ext.getCmp("backupconfig").setDisabled(false);
				}
				
				stopState();
				
			}else{
				Ext.websure.MsgError(code, content);
			}
			myMask.hide();
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip, local.backup.stopFailure);
			Ext.websure.MsgError("WF-30024", local.backup.stopFailure);
			myMask.hide();
		}
	});
}

/**
 * 立即同步
 */
function imediateRunServerMenu(){
		if(deviceStatus == 2) {
			Ext.MessageBox.alert(local.window.tip,local.backup.deviceOffline);
			return;
		} else {
			/* Ext.MessageBox.prompt("提示", "请输入备注信息：", function (id, msg) {
			 	if("ok" == id){
			 		if(""!=msg){
			 			if(__isTCZF_DES(msg)){
			 				Ext.MessageBox.alert(local.window.tip,"备注信息不允许输入特殊字符");
			 				return;
			 			}
			 		}
			 		immediateSyncClone(msg);
			 	}
			 }, this, true);*/
			immediateSyncClone("");
		}
};

function immediateSyncClone(msg) {
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.deviceStart});
	myMask.show();
	
	//立即同步
	Ext.Ajax.request({
			url : '/backup/tobackupAction!immediateClone.action',
			params : {
				selectDeviceMac : selectDeviceMac,
				deviceUuid:deviceUuid,
				deviceId : selectDeviceId,
				msg:msg,
				type:2
			},
			success : function(response, options) {
				var obj=Ext.decode(response.responseText);
				console.log(obj);
				var code = obj.msgCode;
				var content = obj.msgContent;
				if(MSG_NORMAL==code){
					Ext.websure.MsgTip.msg(local.window.tip, content, true);
					runState(3);
					
					diskCloneStatus = 1;
					if(1 == diskCloneStatus){
						Ext.getCmp("backupconfig").setDisabled(true);
					}else{
						Ext.getCmp("backupconfig").setDisabled(false);
					}
					
				}else{
					Ext.websure.MsgError(code, content);
				}
				myMask.hide();
			},
			failure : function() {
//				Ext.MessageBox.alert(local.window.tip,local.backup.imeRunFailure);
				Ext.websure.MsgError("WF-30025",local.backup.imeRunFailure);
				myMask.hide();
			}
		});
}

/**
 * 立即快照
 */
function imediateSnapMenu(){
			if(deviceStatus == 2) {
				Ext.MessageBox.alert(local.window.tip, local.backup.deviceOffline);
				return;
			} else {
				/*Ext.MessageBox.prompt("提示", "请输入备注信息：", function (id, msg) {
			 	if("ok" == id){
			 		if(""!=msg){
			 			if(__isTCZF_DES(msg)){
			 				Ext.MessageBox.alert(local.window.tip,"备注信息不允许输入特殊字符");
			 				return;
			 			}
			 		}
			 		immediateSnapClone(msg);
			 	}
			 }, this, true);*/
				immediateSnapClone("");
			}
			
};

function immediateSnapClone(msg) {
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg :local.backup.deviceStartSnap});
	myMask.show();
		//立即快照
	Ext.Ajax.request({
			url : '/backup/tobackupAction!immediateClone.action',
			params : {
				selectDeviceMac : selectDeviceMac,
				deviceUuid:deviceUuid,
				deviceId : selectDeviceId,
				msg:msg,
				type:1
			},
			success : function(response, options) {
				var obj=Ext.decode(response.responseText);
				console.log(obj);
				var code = obj.msgCode;
				var content = obj.msgContent;
				if(MSG_NORMAL==code){
					Ext.websure.MsgTip.msg(local.window.tip, content, true);
					runState(4);
						
					diskCloneStatus = 1;
					if(1 == diskCloneStatus){
						Ext.getCmp("backupconfig").setDisabled(true);
					}else{
						Ext.getCmp("backupconfig").setDisabled(false);
					}
					
				}else{
					Ext.websure.MsgError(code, content);
				}

				myMask.hide();
			},
			failure : function() {
//				Ext.MessageBox.alert(local.window.tip, local.backup.deviceSnapFailure);
				Ext.websure.MsgError("WF-30026", local.backup.deviceSnapFailure);
				myMask.hide();
			}
		});
}

/**
 * 校验数据
 */
function checkdataMenu(){
		if(deviceStatus == 2) {
			Ext.MessageBox.alert(local.window.tip,local.backup.deviceOffline);
			return;
		} 
	 	//校验数据
		Ext.Ajax.request({
				url : '/backup/tobackupAction!checkHardDiskDataCheck.action',
				params : {
					selectDeviceMac : selectDeviceMac,
					deviceUuid:deviceUuid
				},
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					console.log(obj);
					var code = obj.msgCode;
					var content = obj.msgContent;
					
					if(MSG_NORMAL==code){
						Ext.websure.MsgTip.msg(local.window.tip, content, true);
						//校验数据以后将diskClone的状态设置为运行中
	    				diskCloneStatus = 1;
						runState(5);
					}else{
						Ext.websure.MsgError(code, content);
					}
				},
				failure : function() {
//					Ext.MessageBox.alert(local.window.tip, local.backup.checkDataOpenFailure);
					Ext.websure.MsgError("WF-30027", local.backup.checkDataOpenFailure);
				}
			});
};

function initMenu(){
		Ext.Msg.show({
	        title: local.window.warn,
	        width:350,
	        style:"background-color:#FFF;",
	        msg: local.detailInfo+':<br />&nbsp;&nbsp;&nbsp;&nbsp;'+local.backup.initWarnMsg,
	        buttons: Ext.MessageBox.YESNO,
	        fn: function(v) {
	        	if(v == 'yes') {
	        		var myMask = new Ext.LoadMask(Ext.getBody(), {msg : local.backup.initMsg});
					myMask.show();
		    		//备份初始化
					Ext.Ajax.request({
						url : '/backup/tobackupAction!resetBackUpConfig.action',
						params : {
							selectDeviceMac : selectDeviceMac,
							deviceUuid:deviceUuid
						},
						success : function(response, options) {
							if(TM_HANDLE_UPDATE != -1) {
								clearInterval(TM_HANDLE_UPDATE);
								TM_HANDLE_UPDATE = -1; 
							}
							
							var obj=Ext.decode(response.responseText);
							console.log(obj);
							var code = obj.msgCode;
							var content = obj.msgContent;
							if(MSG_NORMAL==code){
								Ext.websure.MsgTip.msg(local.window.tip, content, true);
								diskCloneStatus = 5;
	        					initState();
							}else{
								Ext.websure.MsgError(code, content);
							}
							//刷新store
							Ext.getCmp("diskinfoList").store.reload();
							if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
								Ext.getCmp("showShareDiskTree").store.reload();
							}
							myMask.hide();
						},
						failure : function() {
							Ext.websure.MsgError("WF-30028", local.backup.initFailureMsg);
							myMask.hide();
						},
						timeout: 20000
					});
	        	}
	        },
	        icon: Ext.MessageBox.WARNING
		});
}
//用于失败次数记数
var i = 0;
//值变化的时候更新grid
var byPartIndex = -1;
var byDiskIndex = -1;
// 更新状态数据包
function startUpdate() {
	
	//获取设备状态 只有2：全盘镜像   5.数据校验的时候才会有进度包，其余收不到客户端反馈
	Ext.Ajax.request({
		url : '/backup/tobackupAction!getDiskCloneProcessState.action',
		params : {
			deviceMac : selectDeviceMac,
			deviceUuid:deviceUuid,
			selectDeviceId:selectDeviceId
		},
		success : function(response, options) {
			i = 0;
			var obj = Ext.decode(response.responseText);
			var progress = obj.info;
			
			if (null != obj.info) {
				//判断是否刷新grid
				if(isClusterDevice){
					updateDiskRunState();
				}else{
					//普通机器
					if(progress.byPartIndex != byPartIndex || progress.byDiskIndex != byDiskIndex ||workState_menu != progress.byEngineWorkState){
						byPartIndex = progress.byPartIndex;
						byDiskIndex = progress.byDiskIndex;
						updateDiskRunState();
						if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
							Ext.getCmp("showShareDiskTree").store.reload();
						}
					}
				}
				
				var partName = Ext.util.Format.htmlEncode(obj.partName);
				workState = progress.byEngineWorkState;
				var runState = progress.byRunState;
				
				
				if(1 == runState){
					if(6 != workState && 0 !=workState){
						var object = document.getElementById('box');
						if(1 == workState){
							workState_menu = 1;
							Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.initing+"</font>");
						}else if(2 == workState){
							workState_menu = 2;
							if(-1 == progress.byProgress){
								progress.byProgress = 0;
							}
							if("" != partName){
								Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.overallMirrorPath+partName+")</font>");
							}else{
								Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.overallMirror+"</font>");
							}
							var imgLeft = -(progress.byProgress * 126) + 'px';
							object.style.backgroundPosition = imgLeft + '\t\n'+ '0px';
							object.innerHTML = "<font class='font_30' style='display:block;margin-top:10px'>"+formatSpeedSize(progress.dwSpeedKB)+"</br>"+progress.byProgress+"%</font>";
						}else if(3 == workState){
							workState_menu = 3;
							Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceSyncing+"</font>");
							object.innerHTML = "<font class='font_h4' style='color:#68ba8a;line-height:45px;'>"+local.backup.syncing+"</font>";
							var imgLeft = -(102 * 126) + 'px';
							object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
						}else if( 4 == workState){
							workState_menu = 4;
							Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceSnaping+"</font>");
							object.innerHTML = '<font class="font_h4" style="color:#68ba8a;line-height:45px;">'+local.backup.snaping+'</font>';
							var imgLeft = -(102 * 126) + 'px';
							object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
						}else if(5 == workState){
							workState_menu = 5;
							Ext.getCmp("operateButton").setDisabled(false);
							Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceChecking+"</font>");
							
							var object = document.getElementById('box');
							var imgLeft = -(progress.byProgress * 126) + 'px';
							object.style.backgroundPosition = imgLeft + '\t\n'
									+ '0px';
							object.innerHTML = "<font class='font_30' style='display:block;margin-top:10px'>"+formatSpeedSize(progress.dwSpeedKB)+"</br>"+progress.byProgress+"%</font>";
						}
						
					}else if(6 == workState){
						workState_menu = 6;
						Ext.getCmp("operateButton").setDisabled(false);
							Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceRunning+"</font>");
							
							var object = document.getElementById('box');
							var imgLeft = -(100 * 126) + 'px';
							object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
							
							object.innerHTML = '<font class="font_h4" style="color:#68ba8a;line-height:45px;">...</font>';
							var flag = Ext.getCmp("operateButton").disabled;
							if(flag){
								Ext.getCmp("operateButton").setDisabled(false);
							}
						}
				}
			}
		},
		failure : function() {                                                                                         
			workState_menu = 6;
			i++;
			if(i >= 5){
				if(TM_HANDLE_UPDATE != -1) {
					clearInterval(TM_HANDLE_UPDATE);
					TM_HANDLE_UPDATE = -1; 
					i=6;
				}
			}
			console.log("Ext_Fail_i=("+i+")_TM_HANDLE_UPDATE-fail="+TM_HANDLE_UPDATE);
		}
	});
}

//不在线
function unOnlineState(){
	Ext.getCmp("controllerState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.backup.offline+"</font></div>");
	Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceOffline+"</font>");
	Ext.getCmp("consol").removeCls("consol_6");
	Ext.getCmp("consol").removeCls("consol_2");
	Ext.getCmp("consol").removeCls("consol_3");
	Ext.getCmp("consol").removeCls("consol_4");
	Ext.getCmp("consol").removeCls("consol_5");
	Ext.getCmp("consol").addCls("consol_1");
	var object = document.getElementById('box');
	var imgLeft = '0px';
	object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
	object.innerHTML = '<font class="font_h4" style="color:#666;line-height:45px;">...</font>';
}

//停止状态
function stopState(){
	Ext.getCmp("controllerState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.backup.pause+"</font></div>");
	Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.devicePause+"</font>");
	Ext.getCmp("consol").removeCls("consol_1");
	Ext.getCmp("consol").removeCls("consol_2");
	Ext.getCmp("consol").removeCls("consol_4");
	Ext.getCmp("consol").removeCls("consol_5");
	Ext.getCmp("consol").removeCls("consol_6");
	Ext.getCmp("consol").addCls("consol_3");
	var object = document.getElementById('box');
	var imgLeft = -(102 * 126) + 'px';
	object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
	object.innerHTML = '<font class="font_h4" style="line-height:45px;">...</font>';
}
//主备切换状态
function switchState(){
	Ext.getCmp("controllerState").update("<div  class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.backup.deviceChange+"</font></div>");
	Ext.getCmp("controllerInfo").update("<span><font size='6' color='#666'>"+local.backup.deviceChange+"</font></span>");
	Ext.getCmp("consol").removeCls("consol_1");
	Ext.getCmp("consol").removeCls("consol_2");
	Ext.getCmp("consol").removeCls("consol_3");
	Ext.getCmp("consol").removeCls("consol_4");
	Ext.getCmp("consol").removeCls("consol_6");
	Ext.getCmp("consol").addCls("consol_5");
	
	var object = document.getElementById('box');
	var imgLeft = -(104 * 126) + 'px';
	object.style.backgroundPosition = imgLeft + '\t\n'+ '0px';
	object.innerHTML = '<font class="font_h4" style="color:#3a7ea5;line-height:45px;">...</font>';
}

//异常状态
function excepState(){
	Ext.getCmp("controllerState").update("<div class='font_h4' ><font color='#ffffff'>"+local.backup.clientState+"</font><font  color='#ffff00'>"+local.abnormal+"</font></div>");
	Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceAbnormal+"</font>");
	Ext.getCmp("consol").removeCls("consol_1");
	Ext.getCmp("consol").removeCls("consol_2");
	Ext.getCmp("consol").removeCls("consol_3");
	Ext.getCmp("consol").removeCls("consol_5");
	Ext.getCmp("consol").removeCls("consol_6");
	Ext.getCmp("consol").addCls("consol_4");
	
	var object = document.getElementById('box');
	var imgLeft = -(103 * 126) + 'px';
	object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
	object.innerHTML = '<font class="font_h4" size="7" style="color:#ff9324;line-height:45px;">...</font>';
}

//运行中状态
function runState(workState){
	//TODO
	var state = Ext.getCmp("controllerState");
	if(typeof(state) === "undefined") {
		return;
	}
	state.update("<div class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.backup.running+"</font></div>");
	
	Ext.getCmp("consol").removeCls("consol_1");
	Ext.getCmp("consol").removeCls("consol_6");
	Ext.getCmp("consol").removeCls("consol_3");
	Ext.getCmp("consol").removeCls("consol_4");
	Ext.getCmp("consol").removeCls("consol_5");
	Ext.getCmp("consol").addCls("consol_2");
	
	var object = document.getElementById('box');

	
	/*if(1 == workState){
		Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.initing+"</font>");
	}else if(2 == workState){
		Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.overallMirror+"</font>");
	}else if(3 == workState){
		Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceSyncing+"</font>");
		object.innerHTML = '<font class="font_h4" style="color:#68ba8a;line-height:45px;">'+local.backup.syncing+'</font>';
		var imgLeft = -(102 * 126) + 'px';
		object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
	}else if( 4 == workState){
		Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceSnaping+"</font>");
		object.innerHTML = '<font class="font_h4" style="color:#68ba8a;line-height:45px;">'+local.backup.snaping+'</font>';
		var imgLeft = -(102 * 126) + 'px';
		object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
	}else if(5 == workState){
		Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceChecking+"</font>");
	}else{*/
		Ext.getCmp("controllerInfo").update("<font size='6' color='#666'>"+local.backup.deviceRunning+"</font>");
		object.innerHTML = '<font class="font_h4" style="color:#68ba8a;line-height:45px;">...</font>';
		
		var imgLeft = -(100 * 126) + 'px';
		object.style.backgroundPosition = imgLeft + '\t\n' + '0px';
//	}
	
	byPartIndex = -1;
	byDiskIndex = -1;
	//运行状态下启动定时器
	if(TM_HANDLE_UPDATE == -1) {
		startUpdate();
		TM_HANDLE_UPDATE = setInterval(startUpdate, 4000);	
	}
	
}

//未配置状态
function initState(){
	Ext.getCmp("controllerState").update("<div  class='font_h4'><font color='#ffffff'>"+local.backup.clientState+"</font><font color='#ffff00'>"+local.unconfig+"</font></div>");
	Ext.getCmp("controllerInfo").update("<span lang='backup_device_configdual' onclick='setBackupConfig()'><font size='6' color='#666'>"+local.backup.deviceUnconfig+"</font></span>");
	Ext.getCmp("consol").removeCls("consol_1");
	Ext.getCmp("consol").removeCls("consol_2");
	Ext.getCmp("consol").removeCls("consol_3");
	Ext.getCmp("consol").removeCls("consol_4");
	Ext.getCmp("consol").removeCls("consol_5");
	Ext.getCmp("consol").addCls("consol_6");
	
	var object = document.getElementById('box');
	var imgLeft = -(105 * 126) + 'px';
	object.style.backgroundPosition = imgLeft + '\t\n'+ '0px';
	object.innerHTML = '<font class="font_h4" style="color:#abad23;line-height:45px;">...</font>';
	
	Ext.getCmp("backupconfig").setDisabled(false);
	POWER_OP.filterEnableWidgetsOfExtjs('DeviceBackup',CURRENT_USER.getBackupPower());
	POWER_OP.filterEnableDomsInHtmlOfExtjs("controllerInfo",CURRENT_USER.getBackupPower(),'span');
}

function formatSpeedSize(value) {
	if(value >= 1024) {
		var tmp = ((value / 1024) + "");
		var idx = tmp.indexOf(".");
		if(idx > 0) {
			value = tmp.substring(0, idx + 3) + "MB/S";
		} else {
			value = tmp + "MB/S";
		}
	} else {
		value += "KB/S";
	}
	return value;
}

/**
 * 判断特殊字符
 * @param {} s
 * @return {}
 */
function __isTCZF_DES(s) {
	var re =/[`~!@#$%^&*_+<>{}\/'"“‘[\]]/im;
	return re.test(s);
}

//单列刷新，磁盘信息中的运行状态
function updateDiskRunState(){
	var store =  Ext.getCmp("diskinfoList").store;
	//集群只能轮训
	Ext.Ajax.request({
		url: '/backup/todeviceAction!getDeviceomtrollerInfo.action',
        params:{
        	isCluster:isClusterDevice,
        	deviceId:selectDeviceId
        },
		success : function(response, options) {
			var data = Ext.decode(response.responseText).children;
			if(null != data && 0 != data.length){
				for(var i = 0;i<data.length;i++){
					var parent = data[i];
					if(null != parent && 0 != parent.children.length){
						for(var j = 0;j<parent.children.length;j++){
							var children = (parent.children)[j];
//							console.log('===='+children.runningStatus);
//							console.log('####'+store.getById(children.id).get('hard_partition_Name'));
							store.getById(children.id).set('runningStatus',children.runningStatus);
						}
					}
				}
			}
		}
	});
}
