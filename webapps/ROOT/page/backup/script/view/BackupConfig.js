parId = null;
selectDeviceComfigMac=null;
selectDeviceComfigUUid=null;
selectDeviceComfigIP=null;
currentPanel = 1;
isNew_page = 0;
snapNum = null;
dataSetNum = null;

//存储ID
var STORAGEID_Config=null;
//存储介质
var STORAGESYMBOL_Config=null;
//存储路径
var PATH_Config=null;
//var DISK_CLONE = null;

var BackupConfig = {
		BACKUP_MAX_SPEED : 102400, 	// kb
		BACKUP_MIN_SPEED : 1024 	// kb
		
}
/**
 * 备份配置模块
 */
Ext.define('websure.backup.view.ConfigTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.configTree',
			id : 'configTree',
			lines : false,
			collapsible : false,
			rootVisible : false,
			root : {
				text : local.btn.backupConfig,
				iconCls : 'no-icon',
				expanded : true,
				children : [{
							text : local.backup.dataSource,
							id : '1',
							icon : '/images/common/pc_online_one.png',
							leaf : true
						}, {
							text : local.backup.synStrategy,
							id : '2',
							icon : '/images/backup/update.png',
							leaf : true
						}, {
							text : local.backup.snapStrategy,
							id : '3',
							icon : '/images/backup/snap.png',
							leaf : true
						}]
			}
		});

/**
 * 共享磁盘panel
 */
Ext.define('websure.backup.view.ShareDiskTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.shareDiskTree',
			id : 'shareDiskTree',
			useArrows : true,
			rootVisible : false,
			width : '100%',
			multiSelect : true,
			disabled : true,
			sortableColumns:false,
			enableColumnMove:false,
			enableColumnResize:false,
			store : 'shareDiskStore',
			columns : [{
						xtype : 'treecolumn',
						text :local.diskInfo,
						flex : 2,
						menuDisabled:true,
						//sortable : true,
						tdCls:"font_bold",
						dataIndex : 'hard_partition_Name'
					},{
						xtype : 'treecolumn',
						text : local.diskInfo,
						flex : 1.5,
						menuDisabled:true,
						//sortable : true,
						dataIndex : 'hardName',
						hidden : true
					}, {
						xtype : 'column',
						text : local.disk+'ID',
						flex : 1.5,
						menuDisabled:true,
						//sortable : true,
						dataIndex : 'hardDiskId',
						hidden : true
					}, {
						xtype : 'column',
						menuDisabed:false,
						text : local.partition+'ID',
						flex : 1.5,
						//sortable : true,
						dataIndex : 'partitionId',
						hidden : true
					}, {
						xtype : 'templatecolumn',
						text : local.backup.gridPartInfo,
						flex : 1,
						menuDisabled:true,
						dataIndex : 'letter',
						tpl : Ext.create('Ext.XTemplate',
								'{letter:this.formatSize}', {
									formatSize : function(v) {
										var subs = v.replace(":", local.backup.gridPartInfoDisk);
										return subs;
									}
								}),
						hidden : true
					}, {
						text : local.backup.diskInfoGridSize,
						width:110,
						menuDisabled:true,
						//sortable : true,
						dataIndex : 'totalSector',
						align : 'left'
					}, {
						text : local.backup.diskInfoGridFormat,
						width:130,
						menuDisabled:true,
						dataIndex : 'fileSystem'
					}],
			height : 400,
			loadMask : {
				msg : local.loading
			}
		});

Ext.define('websure.backup.view.ShareDiskPanel', {
			extend : 'Ext.panel.Panel',
			border : false,
			alias : 'widget.shareDiskPanel',
			id : 'shareDiskPanel',
			autoScroll : true,
			height : 500,
			items : [{
						xtype : 'label',
						id : 'shareHard',
						html : '<b>'+local.backup.diskShare+'</b></br>',
						height : 30
					}, {
						xtype : 'shareDiskTree',
						height : 200
					}]
		})
		
/**
 * 定义磁盘信息tree
 */
Ext.define('websure.backup.view.SelectDiskinfoList', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.selectDiskinfoList',
			id : 'selectDiskinfoList',
			useArrows : true,
			rootVisible : false,
			multiSelect : true,
			sortableColumns:false,
			enableColumnMove:false,
			enableColumnResize:false,
			store : 'DiskInfoStore',
			columns : [{
						xtype : 'treecolumn',
						text : local.diskInfo,
						flex : 2,
						menuDisabled:true,
						//sortable : true,
						tdCls:"font_bold",
						dataIndex : 'hard_partition_Name'
					},{
						xtype : 'treecolumn',
						text :local.diskInfo,
						flex : 1.5,
						menuDisabled:true,
						//sortable : true,
						dataIndex : 'hardName',
						hidden : true
						
					},{
						text : local.backup.mountInfoDot,
						width:130,
						menuDisabled:true,
						align : 'left',
						dataIndex : 'mountInfo'
					}, {
						xtype : 'column',
						text : local.disk+'ID',
						flex : 1.5,
						menuDisabled:true,
						//sortable : true,
						dataIndex : 'hardDiskId',
						hidden : true
					}, {
						xtype : 'column',
						menuDisabled:true,
						text :local.partition+ 'ID',
						flex : 1.5,
						menuDisabled:true,					
						dataIndex : 'partitionId',
						hidden : true
					}, {
						xtype : 'templatecolumn',
						menuDisabled:true,
						text : local.backup.gridPartInfo,
						width:120,
						dataIndex : 'letter',
						tpl : Ext.create('Ext.XTemplate',
								'{letter:this.formatSize}', {
									formatSize : function(v) {
										var subs = v.replace(":", local.backup.gridPartInfoDisk);
										return subs;
									}
								}),
						hidden : true
					}, {
						menuDisabled:true,
						text : local.backup.diskInfoGridSize,
						width:110,
						menuDisabled:true,					
						dataIndex : 'totalSector',
						align : 'left'
					}, {
						text : local.backup.diskInfoGridFormat,
						width:130,
						menuDisabled:true,
						dataIndex : 'fileSystem'
					}],
			height : 400,
			loadMask : {
				msg : local.loading
			},
			listeners : {
				"afterrender" : function(node,eOpts){
					var grid = Ext.getCmp("selectDiskinfoList");
					if(null != deClientSystype){
						if(0 <= deClientSystype && deClientSystype <= 28){
							grid.columns[2].hide();
						}else{
							grid.columns[2].show();
						}
					}
				},
				"checkchange" : function(node, checked) {
					//fixbug:1983
                    var fileSystem = node.data.fileSystem;
                    if(fileSystem == "Unknown" && checked){
                        Ext.Msg.confirm('提示',"确定备份该分区?(该分区的分区格式未知,将产生大量备份数据!",
                                  function(bt){
                                    if("no" == bt){
                                        node.set('checked', false);
                                    }else{
                                        backupConfigCheckEvent(node,checked);
                                    }                                   
                        });
                        
                    }else{
                       backupConfigCheckEvent(node,checked);
                    }
					addMoreText();    //鼠标悬浮显示全部信息
				},
				afteritemexpand:function(){
									var gridTr=$("#selectDiskinfoList-body table tr");
									gridTr.each(function(){
										var format=$(this).find("td:last div.x-grid-cell-inner").text();
										if(format=="LVM2_member"){
												$(this).find("td:first div.x-grid-cell-inner input").attr("disabled","disabled");
												$(this).find("td:first div.x-grid-cell-inner input").css("opacity","0.3");
										}
									})	
									addMoreText();    //鼠标悬浮显示全部信息
							}	
				
			}
		});
/**
 * 数据源
 */
Ext.define('websure.backup.view.Configdatasoure', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.configdatasoure',
	id : 'configdatasoure',
	layout : 'vbox',
	items : [{
				xtype : 'label',
				id : 'configdata',
				html : '<b>'+local.backup.choiceSource+'</b>',
				height : 30
			}, {
				xtype : 'selectDiskinfoList',
				height : 400,
				width : '100%',
				listener : {}
			}, {
				xtype : 'panel',
				width : '100%',
				border : false,
				bodyBorder : false,
				style : 'border:1px solid #eef2f4',
				id : 'shareHardDisk',
				style : 'margin-top:20px;'
			}, {
				xtype : 'fieldset',
				id : 'configExplain',
				title:local.explain,
				padding:10,
				style : 'margin-top:20px',
				html : local.backup.dataSourceExplain,
				width : '100%'
			}]
});

/**
 * 存储位置的选择
 */
Ext.define('websure.backup.view.StoragePathTreeConfig',{
	extend:'Ext.tree.Panel',
	alias:'widget.storagePathTreeConfig',
	id:"storagePathTreeConfig",
	cls:"icon_radio",
	useArrows:true,
	rootVisible:false,// 不可见根
	setRootNode: function() {
        if (this.getStore().autoLoad) {
            this.callParent(arguments);
        }
    },
	border:true,
	frame:false,
	sortable:false,
	onlyLeafCheckable: true,
	checkModel:"double",
	store:"NewStorageConfigStore",
	loadMask : {
		msg : local.loading
	},
	listeners:{
		afterrender:function(){
			STORAGESYMBOL_Config = null;
			STORAGEID_Config = null;
			PATH_Config = null;
			this.store.load({
					params : {
						deviceId : parId
					},
					callback : function(r, option, success) {
						//获取树的选中项
				        for(var i=0;i<r.length;i++){
				        	var storage = r[i].data.children;
				           if(storage.length>0){
				           		for(var k=0;k<storage.length;k++){
						          	if(storage[k].checked){
						          		STORAGESYMBOL_Config=storage[k].symbol;
										STORAGEID_Config=storage[k].storageId;
										PATH_Config=storage[k].path;
						          	}
						        }
				           }
				        }
				        if(success){
				        	if(isNew_page==1){
							$("#storagePathTreeConfig").find("input[role='checkbox']").attr("disabled",true);
						}
				        }
             		}
				});
		},
		checkchange:function(node, checked,obj){
			var checkedNodes = this.getChecked();
			for(var i=0;i<checkedNodes.length;i++){
				var n = checkedNodes[i];
				if(node.get("id") != n.get("id")){
						n.set("checked" , false);
				}
			}
			if(this.getChecked().length!=0){
				STORAGESYMBOL_Config=node.get("symbol");
				STORAGEID_Config=node.get("storageId");
				PATH_Config=node.get("path");
			}else{
				STORAGESYMBOL_Config=null;
				STORAGEID_Config=null;
				PATH_Config=null;
			}
		},
		afteritemexpand:function(){
			if(isNew_page==1){
				$("#storagePathTreeConfig").find("input[role='checkbox']").attr("disabled",true);
			}
		}
	}
});

/**
 * 同步策略
 */
Ext.define("websure.backup.view.ConfigStrategy", {
	extend : 'Ext.form.Panel',
	alias : 'widget.configStrategy',
	id : 'configStrategy',
	border : false,
	width : '100%',
	layout : 'vbox',
	defaults : {
		width : '100%'
	},
	items : [{
				title : local.backup.choiceStorage,
				xtype : "fieldset",
				//bodyPadding : 5,
				defaultType : "textfield",
				height:150,
				style:"padding-right:0",
				overflowY:'auto',
				items : [{
					xtype:'storagePathTreeConfig',
					border:false,
					bodyBorder:false,
					width:'100%'
				}]
			}, {
				title : local.backup.synStrategyConfig,
				xtype : "fieldset",
				height : 85,
				bodyPadding : 5,
				items : [{
                            xtype : "checkbox",
                            id : 'interval',
                            name :'diskClone.synchrEnable',
                            inputValue : 1,
                            boxLabel : local.backup.setDataIntervalTime, //显示在复选框右边的文字
                            listeners : {
                                change : function(checkbox,newValue,oldValue,eOpts){
                                    if(newValue){
                                        Ext.getCmp("intervalTime").enable();
                                        Ext.getCmp("intervalType").enable();
                                    }else{
                                        Ext.getCmp("intervalTime").disable();
                                        Ext.getCmp("intervalType").disable();
                                    }
                                }
                                
                            }
                        },{
					        xtype : 'panel',
                            border : false,
                            layout : 'hbox',
                            items : [{
                                        xtype:'textfield',
                                        id: 'deviceId',
                                        name:'diskClone.deviceId',
                                        hidden:true
                                    },{
                                        xtype:'textfield',
                                        id: 'diskcloneId',
                                        name:'diskClone.diskcloneId',
                                        hidden:true
                                    },{
                                        xtype:'textfield',
                                        id: 'isNew',
                                        name:'diskClone.isNew',
                                        hidden:true
                                    },{
										xtype : 'label',
										text : local.backup.interval,
										margin : '0 10 0 10'
									},{
                                        xtype : 'numberfield',
                                        //fieldLabel : local.backup.interval,
                                        hideTrigger : true, //隐藏微调按钮
                                        allowDecimals : false,  //不允许输入小数
                                        nanText :local.recovery.tipNumM,
                                        allowNegative: false, // 允许负数
                                        id : 'intervalTime',
                                        disabled : true,
                                        name :'diskClone.synchrIntervalValue',
                                        //labelWidth : 60,
                                        value : '30',
                                        maxValue : 600,  // 最大值
                                        width : 60
                                    }, {
                                        xtype : "combo",
                                        width : 50,
                                        id :'intervalType',
                                        disabled : true,
                                        name :'diskClone.synchrIntervalType',
                                        editable:false,
                                        style : 'margin-left:10px',
                                        triggerAction : "all",
                                        store : new Ext.data.SimpleStore({
                                                    fields : ['value', 'text'],
                                                    data : [[local.s, 0], [local.m, 1],
                                                            [local.hour, 2],[local.day, 3]]
                                                }),
                                        displayField : "value",
                                        valueField : "text",
                                        queryMode : "local",
                                        forceSelection : true,
                                        typeAhead : true,
                                        value : 1 // 默认选中
                                    }]
				         }]
			}, {
				title : local.backup.synTime,
				xtype : "fieldset",
				bodyPadding : 5,
				height : 85,
				items : [{
							xtype : "checkbox",
							id : 'enableLimitedBackupTime',
							name :'diskClone.enableLimitedBackupTime',
							inputValue : 1,
							boxLabel : local.backup.configSynTimePause,	//显示在复选框右边的文字
							listeners : {
								change : function(checkbox,newValue,oldValue,eOpts){
									if(newValue){
										Ext.getCmp("startTime").enable();
										Ext.getCmp("endTime").enable();
									}else{
										Ext.getCmp("startTime").disable();
										Ext.getCmp("startTime").clearValue();
										Ext.getCmp("endTime").disable();
										Ext.getCmp("endTime").clearValue();
									}
								}
								
							}
						}, {
							xtype : 'panel',
							border : false,
							layout : 'hbox',
							items : [{
										xtype : 'label',
										text : local.backup.fromTime,
										hidden : true,
										margin : '0 10 0 0'
									}, {
										xtype : 'timefield',
										emptyText : local.backup.choose,
										id : 'startTime',
										name :'diskClone.startTime',
										disabled : true,
										editable : false,
										format : 'H:i',
										increment : 30,	//时间颗粒度
										width : 80
									}, {
										xtype : 'label',
										text : '—',
										margin : '0 10 0 10'

									}, {
										xtype : 'timefield',
										emptyText : local.backup.choose,
										disabled : true,
										editable : false,
										id : 'endTime',
										name :'diskClone.endTime',
										format : 'H:i',
										increment : 30, //时间颗粒度
										width : 80
									}, {
										xtype : 'label',
										text : local.backup.pauseSyn,
										margin : '0 0 0 10'
									}]
						}]
			}, {
				title : local.backup.backupSpeedLimit,
				xtype : "fieldset",
				height : 60,
				bodyPadding : 5,
				items : [{
							xtype : 'panel',
							border : false,
							layout : 'hbox',
							items : [{
										xtype : "checkbox",
										id :'limitedBackupSpeed',
										name :'diskClone.limitedBackupSpeed',
										inputValue : 1,
										boxLabel : local.backup.backupSpeedLimitOpen, //显示在复选框右边的文字
										listeners : {
											change : function(checkbox,newValue,oldValue,eOpts){
												if(newValue){
													Ext.getCmp("limitedBackupSpeedKb").enable();
												}else{
													Ext.getCmp("limitedBackupSpeedKb").disable();
													Ext.getCmp("limitedBackupSpeedKb").setValue();
												}
											}
											
										}
									}, {
										xtype : 'numberfield',
										hideTrigger : true,//隐藏微调按钮
										allowDecimals : false, // 不允许输入小数
										nanText : local.recovery.tipNumM,
										disabled : true,
										id : 'limitedBackupSpeedKb',
										name : 'diskClone.limitedBackupSpeedKb',
										labelWidth : 60,
										maxValue : BackupConfig.BACKUP_MAX_SPEED, // 最大值100M
										minValue : BackupConfig.BACKUP_MIN_SPEED, // 最小值1M
										width : 70
									}, {
										xtype : 'label',
										text : 'KB',
										margin : '0 10 0 5'

									}]
						}]
			}, {
				title :'Lan-Free',
				id:'lanfreeConfig',
				xtype : "fieldset",
				height : 50,
				bodyPadding : 5,
				items : [{
					xtype : 'panel',
					border : false,
					layout : 'hbox',
					items : [{
								xtype : "checkbox",
								name :'diskClone.byEnableLanfree',
								id:'byEnableLanfree',
								inputValue : 1,
								boxLabel : '优先使用LAN-FREE通道进行数据同步', //显示在复选框右边的文字
								listeners : {
									change :function(checkbox,newValue,oldValue,eOpts){
										Ext.Ajax.request({
											url : '/backup/tobackupAction!getLanFreeLicense.action',
											success : function(response, options) {
												var resp = Ext.decode(response.responseText);
												if(!resp.result){
													// 没有授权,置灰所有按钮
													var outterBox = Ext.getCmp("lanfreeConfig");
													outterBox.addCls("disabled_field");
													outterBox && outterBox.disable();
													var checkbox = Ext.getCmp("byEnableLanfree");
													checkbox && checkbox.setValue(false);
													Ext.websure.MsgError("WF-30011",'Lan-Free功能未授权，如需开启请联系管理员！');
												}
											},
											failure : function() {
												Ext.websure.MsgError("WF-30008","获取Lan-Free授权失败：网络错误！");
											}
										});
									}
					/*						afterrender:function(){
							Ext.Ajax.request({
								url : '/backup/tobackupAction!getLanFreeLicense.action',
								success : function(response, options) {
									var resp = Ext.decode(response.responseText);
									if(!resp.result){
										// 没有授权
										var outterBox = Ext.getCmp("lanfreeConfig");
										outterBox && outterBox.disable();
									}
								},
								failure : function() {
									
								}
							});
						}*/
								}
							}],
				}]
			},{
				title : local.explain,
				xtype : "fieldset",
				height : 50,
				bodyPadding : 5,
				html : "<font color='red'>"+local.backup.synStrategyExplain+"</font>"
			}]
});

/**
 * 快照策略
 */
Ext.define("websure.backup.view.SnapStrategy", {
	extend : 'Ext.form.Panel',
	alias : 'widget.snapStrategy',
	id : 'snapStrategy',
	border : false,
	layout : 'vbox',
	defaults : {
		width : '100%'
	},
	items : [{
		title : local.backup.snapPeriod,
		xtype : "fieldset",
		height : 60,
		bodyPadding : 5,
		layout : 'column',
		items : [{
					xtype : 'numberfield',
					fieldLabel : local.backup.interval,
					hideTrigger : true,//隐藏微调按钮
					allowDecimals : false, // 不允许输入小数
					nanText : local.recovery.tipNumM,
					id : 'snapIntervalTime',
					name : 'diskClone.snapIntervalValue',
					labelWidth : 60,
					maxValue : 720, // 最大值
					minValue : 1, // 最小值
					columnWidth : .25,
					value : '2'
				}, {
					xtype : "combo",
					width : 50,
					margin:"0 0 0 5",
					triggerAction : "all",
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [[local.hour, 2],[local.day, 3]]
							}),
					displayField : "value",
					valueField : "text",
					queryMode : "local",
					forceSelection : true,
					editable : false,
					typeAhead : true,
					columnWidth : .1,
					id : 'snapIntervalType',
					name : 'diskClone.snapIntervalType',
					value : 3 // 默认选中-天
				}/*, {
					xtype : "label",
					columnWidth : 1,
					padding : '6 6 6 0',
					html : local.backup.snapPeriodConfigDescribe    //此代码对应的国际化文字已删除
				}*/]
	},{
				title : local.backup.snapTimeLimit,
				xtype : "fieldset",
				bodyPadding : 5,
				height : 85,
				items : [{
							xtype : "checkbox",
							id : 'enableLimitedSnapTime',
							name :'diskClone.enableLimitedSnapTime',
							inputValue : 1,
							boxLabel : local.backup.configSnapTimeRange,	//显示在复选框右边的文字
							listeners : {
								change : function(checkbox,newValue,oldValue,eOpts){
									if(newValue){
										Ext.getCmp("startTime_snap").enable();
										Ext.getCmp("endTime_snap").enable();
									}else{
										Ext.getCmp("startTime_snap").disable();
										Ext.getCmp("startTime_snap").clearValue();
										Ext.getCmp("endTime_snap").disable();
										Ext.getCmp("endTime_snap").clearValue();
									}
								}
								
							}
						}, {
							xtype : 'panel',
							border : false,
							layout : 'hbox',
							items : [{
										xtype : 'label',
										text : local.backup.fromTime,
										hidden : true,
										margin : '0 10 0 0'
									}, {
										xtype : 'timefield',
										emptyText : local.backup.choose,
										id : 'startTime_snap',
										name :'diskClone.startTime_snap',
										disabled : true,
										editable : false,
										format : 'H:i',
										increment : 30,	//时间颗粒度
										width : 80
									}, {
										xtype : 'label',
										text : '—',
										margin : '0 10 0 10'
 
									}, {
										xtype : 'timefield',
										emptyText : local.backup.choose,
										disabled : true,
										editable : false,
										id : 'endTime_snap',
										name :'diskClone.endTime_snap',
										format : 'H:i',
										increment : 30, //时间颗粒度
										width : 80
									}, {
										xtype : 'label',
										text : local.backup.snapStart,
										margin : '0 0 0 10'
									}]
						}]
			}, {
		title : local.backup.snapSaveStrategy,
		xtype : "fieldset",
		height : 100,
		bodyPadding : 5,
		layout : 'column',
		items : [{
					xtype : "radiogroup",
					id : "snapRadiogroup",
//					name : 'diskClone.keepsnapType',
					columns : 3,
					items : [{
								boxLabel :local.backup.snapStrategyMost,
								name :'diskClone.keepsnapType',
								id :'astrictpartRadio',
								width : 160,
								height : 35,
								checked:true,
								inputValue : 1
							}, {
								xtype : 'numberfield',
								hideTrigger : true,//隐藏微调按钮
								allowDecimals : false, // 不允许输入小数
								nanText : local.recovery.tipNumM,
								id : 'astrictpartValue',
								name : 'diskClone.keepsnapNum',
								width : 60,
								value: 16,
								padding : '0 0 13 0',
								height : 22
							}, {
								height : 35,
								style : 'display:block;margin-left:2px;',
								xtype : 'label',
								text : local.backup.part
							}, {
								width : 160,
								height : 35,
								boxLabel : local.backup.snapStrategyLong,
								name : "diskClone.keepsnapType",
								id :'astrictdayRadio',
								inputValue : 2
							}, {
								xtype : 'numberfield',
								hideTrigger : true,//隐藏微调按钮
								allowDecimals : false, // 不允许输入小数
								nanText : local.recovery.tipNumM,
								id : 'astrictdayValue',
								name : 'diskClone.keepsnapEnable',
								maxValue : 365, // 最大值
								minValue : 0, // 最小值
								width : 60,
								value : 3,
								disabled : true,
								padding : '0 0 13 0',
								height : 22
							}, {
								style : 'display:block;margin-left:2px;',
								height : 35,
								xtype : 'label',
								text : local.day
							}],
					listeners : {
							change : function(checkbox,newValue,oldValue,eOpts){
								var value = newValue["diskClone.keepsnapType"];
								if(1 == value){
									Ext.getCmp("astrictpartValue").enable();
									Ext.getCmp("astrictdayValue").disable();
								}else{
									Ext.getCmp("astrictpartValue").disable();
									Ext.getCmp("astrictdayValue").enable();
								}
							}
					}
				}]
	}, {
		title : local.backup.snapKeepConfig,
		xtype : "fieldset",
		bodyPadding : 5,
		height : 55,
		layout:"hbox",
		items : [{
					xtype : 'label',
					text : local.backup.snapKeepConfig,
					margin : '2 10 0 0'
				},{
					xtype : 'numberfield',
					hideTrigger : true,//隐藏微调按钮
					allowDecimals : false, // 不允许输入小数
					nanText : local.backup.snapKeepNum,
					id : 'snapKeepfullbackupNum',
					name : 'diskClone.keepfullbackupNum',
					width : 50,
					value : 3,
					padding : '0 0 13 0',
					height : 22
				}, {
					//style : 'display:block;margin-left:2px;',
					//height : 35,
					margin : '2 0 0 0',
					xtype : 'label',
					text : "个"
				}/*{
			xtype : "combo",
			labelAlign : 'left',
			fieldLabel : local.backup.snapKeepNum,
			labelWidth : 70,
			id:'snapKeepfullbackupNum',
			name : 'diskClone.keepfullbackupNum',
			width : 160,
			triggerAction : "all",
			store : new Ext.data.SimpleStore({
						fields : ['value', 'text'],
						data : [['1'+local.backup.part, 1], ['2'+local.backup.part, 2], ['3'+local.backup.part, 3], ['4'+local.backup.part, 4],
								['5'+local.backup.part, 5], ['6'+local.backup.part, 6], ['7'+local.backup.part, 7], ['8'+local.backup.part, 8],
								['9'+local.backup.part, 9],['10'+local.backup.part, 10]]
					}),
			displayField : "value",
			valueField : "text",
			queryMode : "local",
			editable : false,
			forceSelection : true,
			typeAhead : true,
			value : 2 // 默认选中
		}*/]
	}, {
		title : local.backup.particalesSaveConfig,
		xtype : "fieldset",
		height : 60,
		id:'particalesSaveConfig',
		bodyPadding : 5,
//		hidden:true,
		items : [{  
                xtype : "radiogroup",
                labelWidth:120,
                fieldLabel : local.backup.particalesSaveOpen,
                id:'atype',
                layout: 'hbox',
                items: [  
                    {  
                    	flex:1,
                        boxLabel  : local.open, 
                        id        : 'isParticlesRadio1' ,
                       name : 'diskClone.isParticlesData',
                        inputValue: 1 
                         
                    }, {  
                    	flex:4,
                        boxLabel  : local.disabled,  
                        id        : 'isParticlesRadio2', 
                       name : 'diskClone.isParticlesData',
                        inputValue: 2,
                        checked : true
                    }  
                ],
                listeners : {
                	change :function(checkbox,newValue,oldValue,eOpts){
                		// 判断是否有小颗粒授权，没有则禁用掉小颗粒选择框 --> added by Lids on 2017-05-03
						Ext.Ajax.request({
							url : '/backup/tobackupAction!getGrainLicense.action',
							
							success : function(response, options) {
								
								var resp = Ext.decode(response.responseText);
								if(!resp.result){
									// 没有授权,置灰所有按钮
//									var outterBox = Ext.getCmp("snapStrategy");
									var innerBox = Ext.getCmp("particalesSaveConfig");
									innerBox && innerBox.disable();
									var grainCloseRadio = Ext.getCmp("isParticlesRadio2");
									grainCloseRadio && grainCloseRadio.setValue(true);
//									outterBox && outterBox.remove(innerBox);
									Ext.websure.MsgError("WF-30011",'小颗粒功能未授权，如需开启请联系管理员！');
								}
							},
							failure : function() {
//								Ext.MessageBox.alert(local.window.tip,local.backup.diskShareMatchFailure);
								Ext.websure.MsgError("WF-30008","获取小颗粒授权失败：网络错误！");
							}
						});
                	}
					/*afterrender:function(){
						// 判断是否有小颗粒授权，没有则禁用掉小颗粒选择框 --> added by Lids on 2017-05-03
						Ext.Ajax.request({
							url : '/backup/tobackupAction!getGrainLicense.action',
							
							success : function(response, options) {
								
								var resp = Ext.decode(response.responseText);
								if(!resp.result){
									// 没有授权
									var outterBox = Ext.getCmp("snapStrategy");
									var innerBox = Ext.getCmp("particalesSaveConfig");
									outterBox && outterBox.remove(innerBox);
								}
							},
							failure : function() {
//								Ext.MessageBox.alert(local.window.tip,local.backup.diskShareMatchFailure);
								Ext.websure.MsgError("WF-30008",local.backup.diskShareMatchFailure);
							}
						});
					}*/
                }
            }]
	}, {
		title : local.explain,
		xtype : "fieldset",
		height : 55,
		bodyPadding : 5,
		html : "<font color='red'>"+local.backup.snapExplain+"</font>"
	}]
});

/*
 * 备份配置弹出窗口
 */
Ext.define("websure.backup.view.BackupConfig", {
	extend : 'Ext.window.Window',
	title : local.btn.backupConfig,
	draggable : false,
	height : 700,
	width : 800,
	closable : true,
	cls : 'config',
	id : 'configWindow',
	layout : "border",    //窗口布局类型
	modal : true,    //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		var me = this;
		me.items = [{
					xtype : 'configTree',
					region : 'west',
					//height : 580,
					border : false,
					width : 150,
					listeners : {
						afterrender : function() {
							var record = this.getStore().getNodeById('1');
							this.getSelectionModel().select(record);
						},
						itemclick : function(record, item, index, e, eOpts) {
							var ids = item.data.id;
							if ("1" == ids) {
								Ext.getCmp("configdatasoure").show();
								Ext.getCmp("configStrategy").hide();
								Ext.getCmp("snapStrategy").hide();
								
								currentPanel = 1;
								Ext.getCmp("preButton").disable();
								Ext.getCmp("nextButton").enable();
							} else if ("2" == ids) {
								Ext.getCmp("configdatasoure").hide();
								Ext.getCmp("configStrategy").show();
								Ext.getCmp("snapStrategy").hide();
								
								currentPanel = 2;
								Ext.getCmp("preButton").enable();
								Ext.getCmp("nextButton").enable();
							} else if ("3" == ids) {
								Ext.getCmp("configdatasoure").hide();
								Ext.getCmp("configStrategy").hide();
								Ext.getCmp("snapStrategy").show();
								
								currentPanel = 3;
								Ext.getCmp("preButton").enable();
								Ext.getCmp("nextButton").disable();
							}
						}
					}
				}, {
					xtype : 'form',
					region : 'center',
					id : 'configContentPanel',
					style : 'background:#fff;border-left:1px solid #d1dade;',
					border : false,
					overflowY:'auto',
					bodyPadding:20,
					items : [{
						xtype : 'configdatasoure',
						listeners : {
							'afterrender' : function() {
								parId = config.parId;
								Ext.Ajax.request({
									url : '/backup/todeviceAction!checkShareHardForShow.action',
									params : {
										parId : parId
									},
									success : function(response, options) {
										var gridTr=$("#selectDiskinfoList-body table tr");
										gridTr.each(function(){
											var format=$(this).find("td:last div.x-grid-cell-inner").text();
											if(format=="LVM2_member"){
												$(this).find("td:first div.x-grid-cell-inner input").attr("disabled","disabled");
												$(this).find("td:first div.x-grid-cell-inner input").css("opacity","0.3");
											}
										})
										var obj = Ext.decode(response.responseText);
										if ("no" != obj.msg) {
											var shareHardDiskPanel = Ext.getCmp('shareHardDisk');
											shareHardDiskPanel.removeAll();
											shareHardDiskPanel.add({
														xtype : 'shareDiskPanel'
													});
											shareHardDiskPanel.doLayout();

											Ext.getCmp("shareHard").update("<b>"+local.backup.diskShare+"</b>("+local.backup.dShare+obj.msg.split(":")[1]+")</br>");
											
										} else {

										}
										addMoreText();    //鼠标悬浮显示全部信息
									},
									failure : function() {
//										Ext.MessageBox.alert(local.window.tip,local.backup.diskShareMatchFailure);
										Ext.websure.MsgError("WF-30008",local.backup.diskShareMatchFailure);
									}
								});
							}													
						}
					}, {
						xtype : 'configStrategy'
					}, {
						xtype : 'snapStrategy'
					}]
				}, {
					xtype : 'panel',
					region : 'south',
					width : '100%',
					//height:72,
					border : false,
					style:'background:#fafbfc;border-top:1px solid #d1dade;padding:20px',
					bodyStyle:'background:#fafbfc',
					defaults : {
						style : 'margin-left:10px'
					},
					alias : 'widget.configbuttonfirst',
					layout : 'hbox',
					items : [{flex:1,border:false},{
								xtype : 'button',
								text : local.btn.previous,
								id : 'preButton',
								handler : function() {
									var tree = Ext.getCmp('configTree');
									if (2 == currentPanel) {
										Ext.getCmp("configdatasoure").show();
										Ext.getCmp("configStrategy").hide();
										Ext.getCmp("snapStrategy").hide();
										currentPanel = 1;
										Ext.getCmp("preButton").disable();

										var record = tree.getStore().getNodeById('1');
										tree.getSelectionModel().select(record);
									} else if (3 == currentPanel) {
										Ext.getCmp("configdatasoure").hide();
										Ext.getCmp("configStrategy").show();
										Ext.getCmp("snapStrategy").hide();
										currentPanel = 2;
										Ext.getCmp("preButton").enable();
										Ext.getCmp("nextButton").enable();

										var record = tree.getStore()
												.getNodeById('2');
										tree.getSelectionModel().select(record);
									}
								}
							}, {
								xtype : 'button',
								id : 'nextButton',
								text : local.btn.next,
								handler : function() {
									console.log("currentPanel="+currentPanel);
									var tree = Ext.getCmp('configTree');
									if (1 == currentPanel) {
										Ext.getCmp("configdatasoure").hide();
										Ext.getCmp("configStrategy").show();
										Ext.getCmp("snapStrategy").hide();
										currentPanel = 2;
										Ext.getCmp("preButton").enable();

										var record = tree.getStore()
												.getNodeById('2');
										tree.getSelectionModel().select(record);
									} else if (2 == currentPanel) {
										Ext.getCmp("configdatasoure").hide();
										Ext.getCmp("configStrategy").hide();
										Ext.getCmp("snapStrategy").show();
										currentPanel = 3;
										Ext.getCmp("preButton").enable();
										Ext.getCmp("nextButton").disable();

										var record = tree.getStore()
												.getNodeById('3');
										tree.getSelectionModel().select(record);
									}
								}
							},{
								xtype : 'button',
								text : local.btn.save,
								cls:"btn_focus",
								id : 'saveButton',
								handler : function() {
									//获取选择的磁盘，判断有没有选中值
									var selectNodes = Ext.getCmp('selectDiskinfoList').getChecked();
									 if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
										var sharNodes = Ext.getCmp('showShareDiskTree').getChecked();
									 }
									
									if(selectNodes==''){
									    Ext.MessageBox.alert(local.window.tip,local.backup.chooseDataSource);
										return;
									}
									
									//获取存储目标位置
//									var targetPath = Ext.getCmp('');
									if(STORAGESYMBOL_Config == null || STORAGESYMBOL_Config == "") {
										 Ext.MessageBox.alert(local.window.tip,local.backup.chooseStoragePosition);
										return false;
									}
									
									//获取同步策略设置值
									var nSynchrOperIntervalValue = Ext.getCmp('intervalTime').getValue();
									var nSynchrOperIntervalUnit = Ext.getCmp('intervalType').getValue();
									
									if(nSynchrOperIntervalValue <= 0) {
										Ext.MessageBox.alert(local.window.tip,local.backup.minSynTime);
										return false;
									}
									
									if(nSynchrOperIntervalUnit == 0) {//秒
										if(nSynchrOperIntervalValue > 600) {
											Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime_miao);
											return false;
										}
									}else if(nSynchrOperIntervalUnit == 1) {//分
										if(nSynchrOperIntervalValue > 600) {
											Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime_fen);
											return false;
										}
									}else if(nSynchrOperIntervalUnit == 2) {//时
										if(nSynchrOperIntervalValue > 600) {
											Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime_shi);
											return false;
										}
									}else if(nSynchrOperIntervalUnit == 3) {//天
										if(nSynchrOperIntervalValue > 31) {
											Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime);
											return false;
										}
									}
									
									//获取快照间隔时间值
									var enableInterval = Ext.getCmp('interval').getValue();
									if(1 == enableInterval){
                                        var nSnapOperIntervalValue = Ext.getCmp('snapIntervalTime').getValue();
                                        var nSnapOperIntervalUnit = Ext.getCmp('snapIntervalType').getValue();//获取间隔单位
                                        
                                        if(null == nSnapOperIntervalValue){
                                            Ext.MessageBox.alert(local.window.tip,local.backup.minSnapTimeNoNull);
                                            return false;
                                        }
                                        
                                        if(nSnapOperIntervalValue <= 0) {
                                        	Ext.MessageBox.alert(local.window.tip,local.backup.minSnapTime);
                                       	    return false;
                                        }
                                        
                                        if(nSnapOperIntervalUnit == 2) { //小时   
                                            if(nSnapOperIntervalValue > 720) {
                                                Ext.MessageBox.alert(local.window.tip,local.backup.maxSnapTime_shi);
                                                return false;
                                            }
                                        }else if(nSnapOperIntervalUnit == 3) { //天 
                                            if(nSnapOperIntervalValue > 31) {
                                                Ext.MessageBox.alert(local.window.tip,local.backup.maxSnapTime);
                                                return false;
                                            }
                                        }
                                        
                                    }
									
									//获取快照保留天数
									var snapRadiogroup = Ext.getCmp('snapRadiogroup').getChecked();
									if(1 == snapRadiogroup[0].inputValue){
										var nKeepSnapNum = Ext.getCmp('astrictpartValue').getValue();
										if(nKeepSnapNum < 2) {
											Ext.MessageBox.alert(local.window.tip,local.backup.minSnapNum);
											return false;
										}
										if(-1 != snapNum){
											if(nKeepSnapNum > snapNum) {
												Ext.MessageBox.alert(local.window.tip,local.backup.authSnapMaxNum1+snapNum+local.backup.authSnapMaxNum2); 
												return false;
											}
										}else{//授权为无限制
											if(nKeepSnapNum > 256) {
												Ext.MessageBox.alert(local.window.tip,local.backup.snapStrategyMostLessThan256); 
												return false;
											}
										}
										
									}else{
										var nSynchrdaySize = Ext.getCmp('astrictdayValue').getValue();
										if(!(nSynchrdaySize>=1&&nSynchrdaySize<=365)){
											Ext.MessageBox.alert(local.window.tip,local.backup.rangeSnapNum);
											return false;
										}
									}
									
									//获取完整数据集
										var snapFull = Ext.getCmp('snapKeepfullbackupNum').getValue();
										
										if(-1 != dataSetNum){
											if(snapFull > dataSetNum) {
												Ext.MessageBox.alert(local.window.tip,local.backup.authDateMaxNum1+dataSetNum+local.backup.authDateMaxNum2); 
												return false;
											}
											if(1 > snapFull) {
												Ext.MessageBox.alert(local.window.tip,local.backup.snapKeepConfigMoreThan1); 
												return false;
											}
										}else{//完整快照集不限制
											if(2 > snapFull) {
												Ext.MessageBox.alert(local.window.tip,local.backup.snapKeepConfigMoreThan2); 
												return false;
											}else if(snapFull > 64) {
												Ext.MessageBox.alert(local.window.tip,local.backup.snapKeepConfigLessThan64); 
												return false;
											}
										}
									
									//获取同步时间段限制
									var enableLimit = Ext.getCmp('enableLimitedBackupTime').getValue();
									if(1 == enableLimit){
										var start_Time = Ext.getCmp("startTime").getValue();
										var end_Time = Ext.getCmp("endTime").getValue();
										if(null == start_Time){
											Ext.MessageBox.alert(local.window.tip,local.backup.synPauseStartTimeNoNull);
											return false;
										}
										
										if(null == end_Time){
											Ext.MessageBox.alert(local.window.tip,local.backup.synPauseEndTimeNoNull);
											return false;
										}
										
										//同步时间段的开始时间和结束时间的比较
										if(start_Time.getTime() == end_Time.getTime()){
											Ext.MessageBox.alert(local.window.tip,'同步开始时间不能与结束相同');
											return false;
										}
									}
									
									//获取快照时间段限制
									var enableLimit = Ext.getCmp('enableLimitedSnapTime').getValue();
									if(1 == enableLimit){
										var start_Time_snap = Ext.getCmp("startTime_snap").getValue();
										var end_Time_snap = Ext.getCmp("endTime_snap").getValue();
										if(null == start_Time_snap){
											Ext.MessageBox.alert(local.window.tip,local.backup.snapPauseStartTimeNoNull);
											return false;
										}
										
										if(null == end_Time_snap){
											Ext.MessageBox.alert(local.window.tip,local.backup.snapPauseEndTimeNoNull);
											return false;
										}
										
										//快照时间段的开始时间和结束时间的比较
										if(start_Time_snap.getTime() == end_Time_snap.getTime()){
											Ext.MessageBox.alert(local.window.tip,'快照开始时间不能与结束相同');
											return false;
										}
									}
									
									//获取备份速度限制
									var isbackupSpeed = Ext.getCmp('limitedBackupSpeed').getValue();
									if(isbackupSpeed){
										var limitedBackupSpeedKB = Ext.getCmp('limitedBackupSpeedKb').getValue();
										if(limitedBackupSpeedKB < BackupConfig.BACKUP_MIN_SPEED){
											Ext.MessageBox.alert(local.window.tip,local.backup.minBackupSpeedLimit);
										    return false;
										}else if(limitedBackupSpeedKB > BackupConfig.BACKUP_MAX_SPEED){
											Ext.MessageBox.alert(local.window.tip,local.backup.maxBackupSpeedLimit);
										    return false;
										}
									}
									
									//获取选择分区ID
									var arrForPartitionIds = [];
									var arrForVolumenIds = [];
							        Ext.Array.each(selectNodes, function(item){
							        	if(1 == item.data.hardType){//普通
							        		arrForPartitionIds.push(item.data.partitionId);
							        	}else if(2 == item.data.hardType){//LVM
							        		arrForVolumenIds.push(item.data.partitionId);
							        	}
							        		 
							        });
							        //获取共享分区ID
							        var arrForSharePartitionIds = [];
							        var arrForShareVolumeIds = [];
							        if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
										 Ext.Array.each(sharNodes, function(item){
										 	console.log(item.data)
							        		 if(1 == item.data.hardType){//普通
							        			 arrForSharePartitionIds.push(item.data.partitionId);
									         }else if(2 == item.data.hardType){//LVM
									        	 arrForShareVolumeIds.push(item.data.partitionId);
									         }
							       	 	});
									}
									selectDeviceComfigMac = config.parMac;
									selectDeviceComfigUUid = config.parUUid;
									selectDeviceComfigIP = config.parIp;
									var loadMarsk_config = new Ext.LoadMask(Ext.getCmp("configWindow"), {
														msg : local.backup.configSavingMsg,
														removeMask : true// 完成后移除
														});
										loadMarsk_config.show(); //显示
										var load_config =new Ext.util.DelayedTask(function(){  
										               loadMarsk_config.hide()
										            });  
									Ext.getCmp('configContentPanel').getForm().submit({
										url : '/backup/tobackupAction!saveDiskCloneConfig.action',
										params: {
											isNew : isNew_page,//用来判断是否为第一次配置
									     partitionNodes: arrForPartitionIds,
									     volumeNodes:arrForVolumenIds,
									     storageSymbol:STORAGESYMBOL_Config,
									     storagePath : PATH_Config,
									     selectDeviceComfigMac:selectDeviceComfigMac,
									     selectDeviceComfigUUid:selectDeviceComfigUUid,
									     selectDeviceComfigIP:selectDeviceComfigIP,
									     arrForSharePartitionIds : arrForSharePartitionIds,
									     arrForShareVolumeIds : arrForShareVolumeIds
									    },
									    timeout: 10000, 
										success : function(form, action) {
//											var obj = JSON.parse(action.result.msg);
											
											
											var obj = action.result; //吧字符串变为json格式
											var code = obj.msgCode;
											var content = obj.msgContent;
											if(MSG_NORMAL==code){
												Ext.websure.MsgTip.msg(local.window.tip, content, true);
												Ext.getCmp("controllerState").update("<div class='font_h4'><font color='#ffffff'>"
															+ local.backup.clientState
															+ "</font><font color='#ff0'>"+local.backup.pause+"</font></div>");
													Ext.getCmp("controllerInfo")
															.update("<font size='6' color='#666'>"+local.backup.devicePause+"</font>")
													Ext.getCmp("consol").removeCls("consol_1");
													Ext.getCmp("consol").removeCls("consol_2");
													Ext.getCmp("consol").removeCls("consol_4");
													Ext.getCmp("consol").removeCls("consol_5");
													Ext.getCmp("consol").removeCls("consol_6");
													Ext.getCmp("consol").addCls("consol_3");
													var object = document.getElementById('box');
													var imgLeft = -(102 * 126) + 'px';
													object.style.backgroundPosition = imgLeft + '\t\n'
															+ '0px'
													object.innerHTML = '<font class="font_30" style="line-height:45px;">...</font>';
													
											}else{
												Ext.websure.MsgError(code, content);
												/*if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
															Ext.getCmp("showShareDiskTree").store.reload();
													  }*/
											}
											diskCloneStatus = 2;//diskClone状态为暂停状态
											Ext.getCmp('configWindow').destroy();
											
											//刷新store
											Ext.getCmp("diskinfoList").store.reload();
											if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
												Ext.getCmp("showShareDiskTree").store.reload();
											}
											
											if(2 == Ext.getCmp("detailtabPanel").activeTab.itemId){
												// 备份策略详情
												Ext.getCmp("backupStrategy").store.load({
													params : {
														deviceId : selectDeviceId
													}
												});
											}
											
										},
										failure : function() {
//											Ext.MessageBox.alert(local.window.tip,local.backup.modifyFailure);
											Ext.websure.MsgError("WF-30009",local.backup.modifyFailure);
											
											Ext.getCmp('configWindow').destroy();
										}
									});
									currentPanel = 1;
								}
							},{
								xtype : 'button',
								text : local.btn.cancle,
								id : 'cancelButton',
								handler : function() {
									currentPanel = 1;
									Ext.getCmp('configWindow').destroy();
									Ext.getCmp("diskinfoList").store.reload();
									if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
										Ext.getCmp("showShareDiskTree").store.reload();
									}
								}
							} ]

				}];
		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
			console.log("currentPanel_afterrender="+currentPanel)
			Ext.getCmp("configStrategy").hide();
			Ext.getCmp("snapStrategy").hide();
			if (1 == currentPanel) {
				Ext.getCmp("preButton").disable();
			}
		var a =  Ext.getCmp('selectDiskinfoList').getChecked();
		if(a.length > 1){
			isNew_page = 1;
		}else if(a.length == 1){
			if("root" == a[0].internalId){
				isNew_page = 0;
			}else{
				isNew_page = 1;
			}
		}else{
			isNew_page = 0;
		}
		
		//如果是第一次配置的情况下，存储介质可以选择，如果不是第一次，存储介质不能修改
		
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
		});
		//填充数据
		Ext.Ajax.request({
						url : '/backup/tobackupAction!getDiskCloneConfig.action',
						params : {
							deviceId : parId
						},
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							//设置diskCloneId
							Ext.getCmp("diskcloneId").setValue(obj.total.diskcloneId);
							//设置deviceId
							Ext.getCmp("deviceId").setValue(parId);
							//设置isNew
							Ext.getCmp("isNew").setValue(obj.total.isNew);
							
							//启用同步策略设置
							if(1 == obj.total.synchrEnable){
								Ext.getCmp("interval").setValue(1);
								Ext.getCmp("intervalTime").setValue(obj.total.synchrIntervalValue);
								Ext.getCmp("intervalType").setValue(obj.total.synchrIntervalType);
							}
							if(1 == obj.total.byEnableLanfree){
								Ext.getCmp("byEnableLanfree").setValue(true);
							}
							//备份速度限制
							if(1 == obj.total.limitedBackupSpeed){
								Ext.getCmp("limitedBackupSpeed").setValue(1);
								Ext.getCmp("limitedBackupSpeedKb").setValue(obj.total.limitedBackupSpeedKb);
							}
							
							//同步时间段限制
							if(1 == obj.total.enableLimitedBackupTime){
								Ext.getCmp("enableLimitedBackupTime").setValue(1);
								var arrForCom = obj.total.limitedBackupTime.split(";");
								Ext.getCmp("startTime").setValue(arrForCom[0]);
								Ext.getCmp("endTime").setValue(arrForCom[1]);
							}
							
							//快照时间段限制
							if(1 == obj.total.enableLimitedSnapTime){
								Ext.getCmp("enableLimitedSnapTime").setValue(1);
								var arrForCom = obj.total.snapTimeRange.split(";");
								Ext.getCmp("startTime_snap").setValue(arrForCom[0]);
								Ext.getCmp("endTime_snap").setValue(arrForCom[1]);
							}
							
						   //快照周期设置
							if(0 != obj.total.snapIntervalValue){
								Ext.getCmp("snapIntervalTime").setValue(obj.total.snapIntervalValue);
							}
//							if(0 != obj.total.snapIntervalType){
								Ext.getCmp("snapIntervalType").setValue(obj.total.snapIntervalType);
//							}
								
						   //快照保存策略
								//选中radio
								if(1 == obj.total.keepsnapType){
									Ext.getCmp("astrictpartRadio").setValue(true);
									if(0 != obj.total.keepsnapNum){
										Ext.getCmp("astrictpartValue").setValue(obj.total.keepsnapNum);
									}
								}else if(2 == obj.total.keepsnapType){
									Ext.getCmp("astrictdayRadio").setValue(true);
									if(0 != obj.total.keepsnapEnable){
										Ext.getCmp("astrictdayValue").setValue(obj.total.keepsnapEnable);
									}
								}else{
									Ext.getCmp("astrictpartRadio").setValue(true);
									if(0 != obj.total.keepsnapNum){
										Ext.getCmp("astrictpartValue").setValue(64);
									}
								}
							
							//完整保留策略设置
								Ext.getCmp("snapKeepfullbackupNum").setValue(obj.total.keepfullbackupNum);

							//颗粒存储策略
								var radio1 = Ext.getCmp("isParticlesRadio1");
								var radio2 = Ext.getCmp("isParticlesRadio2");
								if(1 == obj.total.isParticlesData){
									radio1 && radio1.setValue(true);
								}else{
									radio2 && radio2.setValue(true);
								}

								if(isNew_page==1){
									Ext.getCmp("particalesSaveConfig").addCls("disabled_field");
									Ext.getCmp("isParticlesRadio1").readOnly = true;
									Ext.getCmp("isParticlesRadio2").readOnly = true;
									$("#storagePathTreeConfig").find("input[role='checkbox']").attr("disabled",true);
								} else {
									Ext.getCmp("particalesSaveConfig").removeCls("disabled_field");
									Ext.getCmp("isParticlesRadio1").readOnly = false;
									Ext.getCmp("isParticlesRadio2").readOnly = false;
								}
								
						},
						failure : function() {
//							Ext.MessageBox.alert(local.window.tip,local.backup.dataMatchFailure);
							Ext.websure.MsgError("WF-30010",local.backup.dataMatchFailure);
						}
					});
		
		},
		'close' : function(){
      		currentPanel = 1;
			Ext.getCmp('configWindow').destroy();
			Ext.getCmp("diskinfoList").store.reload();
			if(typeof(Ext.getCmp("showShareDiskTree")) !='undefined'){
				Ext.getCmp("showShareDiskTree").store.reload();
			}
  		}
	}
});

function setChildDiskChecked(node, checked) {
	var cou = 0;
	node.expand();
	console.log("node has child:"+node.hasChildNodes());
	node.set('checked', checked);
	if (node.hasChildNodes()) {
		node.eachChild(function(item) {
			if('2' != item.data.partitionStandbyModel){		
				setChildDiskChecked(item, checked);
			}else{
				item.set('checked', !checked);
				cou++;
			}
		});
		
		if(cou>0){
			node.set('checked', !checked);
		}
	}else if(node.data.hardName !=""){//硬盘下没有分区不让选择
		node.set('checked', false);
	}
}
function setParentDiskChecked(node, checked) {
    //使到该节点的路径上的节点均为选中状态 
    if(checked){
        //判断不是root节点  
         if (node.parentNode.id.split("-")[1] != 'root') {
            //若父节点没有选中，则继续向上选中父节点 
             if(!node.parentNode.checked){
                node.parentNode.set('checked', checked);  
            }
		 }
    }else{
		if (node.parentNode.id.split("-")[1] != 'root') {     
		    //如果父节点没有被选中的子节点，则设为非选中状态
		    if(!node.parentNode.findChild('checked',true)){    
				node.parentNode.set('checked', checked);  
		    }
		}else{
		    if(!node.parentNode.findChild('checked',true)){
				node.parentNode.set('checked', checked);          
			}
		}
	} 
}

/**
 * 备份配置，硬盘或分区选择事件
 */
function backupConfigCheckEvent(node,checked){
    var LvmCount = 0;
    if('2' != node.data.partitionStandbyModel){
        setChildDiskChecked(node, checked);
        setParentDiskChecked(node, checked);
        if(node.hasChildNodes()){
            node.eachChild(function(item,index) {
                if('2' != item.data.partitionStandbyModel){
                    if(typeof(Ext.getCmp("shareDiskTree")) != "undefined"){
                         if(typeof(Ext.getCmp("shareDiskTree").getStore().getNodeById('p-'+item.raw.standbyPartitionId)) != "undefined"){
                            var record = Ext.getCmp("shareDiskTree").getStore().getNodeById('p-'+item.raw.standbyPartitionId)
                            record.set('checked', checked);
                            record.parentNode.set('checked', checked);
                         }
                    }
                }else{
                    LvmCount++;
                    node.set('checked', !checked);                  
                    item.set('checked', !checked);                  
                }
                if("LVM2_member" == item.data.fileSystem){
                    LvmCount++
                    item.set('checked', false);
                }
            });
            if(LvmCount >= node.childNodes.length){
                node.set('checked', false); 
            }
            
            var gridTr=$("#selectDiskinfoList-body table tr");
            gridTr.each(function(){
                var format=$(this).find("td:last div.x-grid-cell-inner").text();
                if(format=="LVM2_member"){
                    $(this).find("td:first div.x-grid-cell-inner input").attr("disabled","disabled");
                    $(this).find("td:first div.x-grid-cell-inner input").css("opacity","0.3");
                }
            })
        }else{
            if(typeof(Ext.getCmp("shareDiskTree")) != "undefined"){
                
                if(typeof(Ext.getCmp("shareDiskTree")) != "undefined"){
                    if(typeof(Ext.getCmp("shareDiskTree").getStore().getNodeById('p-'+node.raw.standbyPartitionId)) != "undefined"){
                        var record = Ext.getCmp("shareDiskTree").getStore().getNodeById('p-'+node.raw.standbyPartitionId)
                        record.set('checked', checked);
                        if (record.parentNode.id.split("-")[1] != 'root') {     
                            record.parentNode.set('checked', checked);
                        }
                     }
                }
            }
        }
    }else{
        Ext.MessageBox.alert(local.window.tip,local.backup.winEditSharePartNot);
        node.set('checked', !checked);
    }
}

function addMoreText(){
	//添加悬浮信息，显示全部内容
	var moreInfoTitle=$("#configdatasoure .x-tree-node-text ");
	moreInfoTitle.each(function(){
		$(this).attr("title",$(this).text());
	})
}