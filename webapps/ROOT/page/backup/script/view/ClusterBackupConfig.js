clusterId = null;
var clusterCurrentPanel = 1;
var clusterIsFirstBackup = 0;
var partitionIds_old = [];
var volumeIds_old = [];
var hardDiskIds_old = [];
clusterSnapNum = null;
clusterDataSetNum = null;

//存储ID
var STORAGEID_Config=null;
//存储介质
var STORAGESYMBOL_Config=null;
//存储路径
var PATH_Config=null;
//var DISK_CLONE = null;
/**
 * 备份配置模块
 */
Ext.define('websure.backup.view.ClusterConfigTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.ClusterConfigTree',
			id : 'clusterConfigTree',
			lines : false,
			collapsible : false,
			rootVisible : false,
			root : {
				text : local.btn.backupConfig,
				iconCls : 'no-icon',
				expanded : true,
				children : [{
							text : local.backup.dataSource,
							id : 'cluster_backup_1',
							icon : '/images/common/pc_online_one.png',
							leaf : true
						}, {
							text : local.backup.synStrategy,
							id : 'cluster_backup_2',
							icon : '/images/backup/update.png',
							leaf : true
						}, {
							text : local.backup.snapStrategy,
							id : 'cluster_backup_3',
							icon : '/images/backup/snap.png',
							leaf : true
						}]
			}
		});

/**
 * 共享磁盘树型面板展示
 */
Ext.define('websure.backup.view.ClusterShareDiskTree',{
    extend:'Ext.tree.Panel',
    alias:'widget.ClusterShareDiskTree',
    id:"clusterShareDiskTree",
    useArrows:true,
    rootVisible:false,
    border:true,
    frame:false,
    loadMask : {
        msg : local.loading
    },
    initComponent : function() {
        var me = this;
        var clusterShareDiskStore=Ext.create("websure.backup.store.ClusterShareDiskTreeStore");
        clusterShareDiskStore.load({params:{clusterId:clusterId}});
        Ext.applyIf(me, {
            store:clusterShareDiskStore,
            columns : [{
                xtype : 'treecolumn',
                text :local.backup.deviceDiskPartition,
                flex :3.5,
                tdCls:'check_dis',
                menuDisabled:true,
                dataIndex : 'device_hard_partition_Name'
            },{
                text : 'deviceID',
                flex : 1,
                menuDisabled:true,
                dataIndex : 'deviceId',
				hidden : true
            },{
                text : 'hardDiskID',
                flex : 1,
                menuDisabled:true,
                dataIndex : 'hardDiskId',
				hidden : true
            },{
                text : 'partitionID',
                flex : 1,
                menuDisabled:true,
                dataIndex : 'partitionId',
				hidden : true
            },{
                text : local.backup.harddiskNeedbackup,
                flex : 1,
                menuDisabled:true,
                dataIndex : 'harddiskNeedbackup',
				hidden : true
            },{
                text :local.backup.clusterTypeShareDisk,
                flex : 1,
                menuDisabled:true,
                dataIndex : 'clusterType',
				hidden : true
            },
            {
                text : local.backup.mountInfoDot,
                flex : 1,
                menuDisabled:true,
                dataIndex : 'mountInfo'
            },
            {
				menuDisabled:true,
                text : local.capacity,
                flex : 1,
                dataIndex : 'totalSector',
                align : 'center'
            },{
                text : local.backup.diskInfoGridFormat,
                flex : 1.1,
                menuDisabled:true,
                dataIndex : 'fileSystem'
            }
            ]
        });
        me.callParent(arguments);
    },
    listeners : {
    	'checkchange':function(node, checked,obj){
    		if(checked){
				selChild(node, checked);    //选中子节点 TODO
				chooseSameDisk(node,checked);    //同步下面的磁盘
				disabledCheckboxDevice();
    		}
    		else {
    			dSelChild(node,checked);    //取消选中子节点
    			cancleChooseSameDisk(node,checked);    //取消同步下面的磁盘
    			disabledCheckboxDevice();
    		}
    	},
		'afteritemexpand':function(){
			disabledCheckboxDevice();
			clusterAddMoreText();
		},
    	'afteritemcollapse':function(){
	    	disabledCheckboxDevice();
	    	clusterAddMoreText();
    	}
	}
});

/**
 * 集群设备-磁盘-分区 展示
 */
Ext.define('acesure.recovery.view.ClusterDeviceHardTree',{
    extend:'Ext.tree.Panel',
    alias:'widget.ClusterDeviceHardTree',
    id:"clusterDeviceHardTree",
    useArrows:true,
    rootVisible:false,
    hideHeaders:true,
    frame:false,
    loadMask : {
        msg : local.loading
    },
    initComponent : function() {
        var me = this;
        var clusterDeviceStore=Ext.create("websure.backup.store.ClusterDeviceDiskTreeStore");
        clusterDeviceStore.load({params:{clusterId:clusterId},callback: function(records){
                partitionIds_old.splice(0,partitionIds_old.length);//清空数组 
				volumeIds_old.splice(0,volumeIds_old.length);//清空数组 
				hardDiskIds_old.splice(0,hardDiskIds_old.length);//清空数组 
    			var selectNodes_old = Ext.getCmp('clusterDeviceHardTree').getChecked();
			    Ext.Array.each(selectNodes_old, function(item){
					 	if(1 == item.raw.isHardDisk){//磁盘
			    			hardDiskIds_old.push(item.raw.hardDiskId);
					 	}else{//分区
					 		 if(1 == item.raw.hardType){//普通
			    			 	partitionIds_old.push(item.raw.partitionId);
					         }else if(2 == item.raw.hardType){//LVM
					        	 volumeIds_old.push(item.raw.partitionId);
					         }
					 	}
			    });
			console.log("hardDiskIds_old--"+hardDiskIds_old);
	        console.log("partitionIds_old--"+partitionIds_old);
	        console.log("volumeIds_old--"+volumeIds_old);
        }});
        Ext.applyIf(me, {
            store:clusterDeviceStore,
            columns : [{
                xtype : 'treecolumn',
                text : local.disk,
                flex : 3.5,
				menuDisabled:true,
                dataIndex : 'device_hard_partition_Name'
            },{
                text : 'deviceID',
                flex : 1,
                menuDisabled:true,
                dataIndex : 'deviceId',
				hidden : true
            },{
                text : 'hardDiskID',
                flex : 1,
                tdCls:'hardDiskId',
                menuDisabled:true,
                dataIndex : 'hardDiskId',
				hidden : true
            },{
                text : 'partitionID',
                flex : 1,
                menuDisabled:true,
                dataIndex : 'partitionId',
				hidden : true
            },{
                text : local.backup.harddiskNeedbackup,
                flex : 1,
                menuDisabled:true,
                dataIndex : 'harddiskNeedbackup',
				hidden : true
            },{
                text : local.backup.clusterTypeShareDisk,
                flex : 1,
                tdCls:'shareDiskBack',
                menuDisabled:true,
                dataIndex : 'clusterType',
				hidden : true
            },
            {
                text : local.backup.mountInfoDot,
                flex : 1,
                menuDisabled:true,
                dataIndex : 'mountInfo'
            },
            {
            	flex : 1,
             	menuDisabled:true,
				dataIndex : 'totalSector',
				align : 'left'
            }, {
                text : local.backup.diskInfoGridFormat,
                flex : 1.1,
                tdCls:'file_system',
                menuDisabled:true,
                dataIndex : 'fileSystem'
            }]
        });
        me.callParent(arguments);
    }
});

/**
 * 数据源
 */
Ext.define('websure.backup.view.ClusterConfigdatasoure', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.ClusterConfigdatasoure',
	id : 'clusterConfigdatasoure',
	width:'100%',
	height:'100%',
	layout : 'vbox',
	items : [{
				xtype : 'label',
				id : 'clusterConfigdata',
				html : '<b>'+local.backup.choiceSource+'</b>',
				height : 30
			},{
				xtype : 'ClusterShareDiskTree',
				height:257,
				width : '100%'
			},{
				xtype : 'ClusterDeviceHardTree',
				height : 255,
				width : '100%',			
			    listeners : {
					'afteritemexpand':function(){
						disabledCheckboxShare();
						disabledCheckboxFormat();
						clusterAddMoreText();
					},
			    	'afteritemcollapse':function(){
			    		disabledCheckboxShare();
			    		disabledCheckboxFormat();
			    		clusterAddMoreText();
			    	},
			    	'checkchange':function(node, checked,obj){

			    		if(checked){
							selChild(node, checked);
							disabledCheckboxDevice();
							disabledCheckboxFormat();
							clusterSetParentDiskChecked(node,checked);
							
			    		}
			    		else {
			    			dSelChild(node,checked);
			    			disabledCheckboxDevice();
			    			disabledCheckboxFormat();
			    			clusterSetParentDiskChecked(node,checked);
			    		}
			    	}
				}
			}]
});

/**
 * 存储位置的选择
 */
Ext.define('websure.backup.view.ClusterStoragePathTreeConfig',{
	extend:'Ext.tree.Panel',
	alias:'widget.ClusterStoragePathTreeConfig',
	id:"clusterStoragePathTreeConfig",
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
	store:"ClusterStorageConfigStore",
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
						clusterId : clusterId
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
				        	if(clusterIsFirstBackup==1){
							$("#clusterStoragePathTreeConfig").find("input[role='checkbox']").attr("disabled",true);
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
			if(clusterIsFirstBackup==1){
				$("#clusterStoragePathTreeConfig").find("input[role='checkbox']").attr("disabled",true);
			}
		}
	}
});

/**
 * 同步策略
 */
Ext.define("websure.backup.view.ClusterConfigStrategy", {
	extend : 'Ext.form.Panel',
	alias : 'widget.ClusterConfigStrategy',
	id : 'clusterConfigStrategy',
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
				height:200,
				style:"padding-right:0",
				overflowY:'auto',
				items : [{
					xtype:'ClusterStoragePathTreeConfig',
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
                            id : 'clusterSyntimeCycleSwitch',
                            name :'cluster.clusterSyntimeCycleSwitch',
                            inputValue : 1,
                            boxLabel : local.backup.setDataIntervalTime, //显示在复选框右边的文字
                            listeners : {
                                change : function(checkbox,newValue,oldValue,eOpts){
                                    if(newValue){
                                        Ext.getCmp("clusterSyntimeCycleValue").enable();
                                        Ext.getCmp("clusterSyntimeCycleType").enable();
                                    }else{
                                        Ext.getCmp("clusterSyntimeCycleValue").disable();
                                        Ext.getCmp("clusterSyntimeCycleValue").setValue('30');
                                        Ext.getCmp("clusterSyntimeCycleType").disable();
                                        Ext.getCmp("clusterSyntimeCycleType").setValue(1);
                                    }
                                }
                                
                            }
                        },{
					        xtype : 'panel',
                            border : false,
                            layout : 'hbox',
                            items : [{
                                        xtype:'textfield',
                                        id: 'clusterId',
                                        name:'cluster.clusterId',
                                        hidden:true
                                    },{
                                        xtype:'textfield',
                                        id: 'clusterType',
                                        name:'cluster.clusterType',
                                        hidden:true
                                    },{
                                        xtype:'textfield',
                                        id: 'clusterOpration',
                                        name:'cluster.clusterOpration',
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
                                        id : 'clusterSyntimeCycleValue',
                                        disabled : true,
                                        name :'cluster.clusterSyntimeCycleValue',
                                        //labelWidth : 60,
                                        value : '30',
                                        maxValue : 600,  // 最大值
                                        width : 60
                                    }, {
                                        xtype : "combo",
                                        width : 50,
                                        id :'clusterSyntimeCycleType',
                                        disabled : true,
                                        name :'cluster.clusterSyntimeCycleType',
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
							id : 'clusterSyntimeRangeSwitch',
							name :'cluster.clusterSyntimeRangeSwitch',
							inputValue : 1,
							boxLabel : local.backup.configSynTimePause,	//显示在复选框右边的文字
							listeners : {
								change : function(checkbox,newValue,oldValue,eOpts){
									if(newValue){
										Ext.getCmp("clusterStartTime_Syn").enable();
										Ext.getCmp("clusterEndTime_Syn").enable();
									}else{
										Ext.getCmp("clusterStartTime_Syn").disable();
										Ext.getCmp("clusterStartTime_Syn").clearValue();
										Ext.getCmp("clusterEndTime_Syn").disable();
										Ext.getCmp("clusterEndTime_Syn").clearValue();
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
										id : 'clusterStartTime_Syn',
										name :'cluster.clusterStartTime_Syn',
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
										id : 'clusterEndTime_Syn',
										name :'cluster.clusterEndTime_Syn',
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
										id :'clusterLimiteSwitch',
										name :'cluster.clusterLimiteSwitch',
										inputValue : 1,
										boxLabel : local.backup.backupSpeedLimitOpen, //显示在复选框右边的文字
										listeners : {
											change : function(checkbox,newValue,oldValue,eOpts){
												if(newValue){
													Ext.getCmp("clusterLimiteValue").enable();
												}else{
													Ext.getCmp("clusterLimiteValue").disable();
													Ext.getCmp("clusterLimiteValue").setValue();
												}
											}
											
										}
									}, {
										xtype : 'numberfield',
										hideTrigger : true,//隐藏微调按钮
										allowDecimals : false, // 不允许输入小数
										nanText : local.recovery.tipNumM,
										disabled : true,
										id : 'clusterLimiteValue',
										name : 'cluster.clusterLimiteValue',
										labelWidth : 60,
										maxValue : 102400, // 最大值100M
										minValue : 1024, // 最小值1M
										width : 70
									}, {
										xtype : 'label',
										text : 'KB',
										margin : '0 10 0 5'

									}]
						}]
			}, {
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
Ext.define("websure.backup.view.ClusterSnapStrategy", {
	extend : 'Ext.form.Panel',
	alias : 'widget.ClusterSnapStrategy',
	id : 'clusterSnapStrategy',
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
					id : 'clusterSnapCycleValue',
					name : 'cluster.clusterSnapCycleValue',
					labelWidth : 60,
					maxValue : 720, // 最大值
					minValue : 1, // 最小值
					columnWidth : .25,
					value : 2
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
					id : 'clusterSnapCycleType',
					name : 'cluster.clusterSnapCycleType',
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
							id : 'clusterSnapRangeSwitch',
							name :'cluster.clusterSnapRangeSwitch',
							inputValue : 1,
							boxLabel : local.backup.configSnapTimeRange,	//显示在复选框右边的文字
							listeners : {
								change : function(checkbox,newValue,oldValue,eOpts){
									if(newValue){
										Ext.getCmp("clusterStartTime_snap").enable();
										Ext.getCmp("clusterEndTime_snap").enable();
									}else{
										Ext.getCmp("clusterStartTime_snap").disable();
										Ext.getCmp("clusterStartTime_snap").clearValue();
										Ext.getCmp("clusterEndTime_snap").disable();
										Ext.getCmp("clusterEndTime_snap").clearValue();
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
										id : 'clusterStartTime_snap',
										name :'cluster.clusterStartTime_snap',
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
										id : 'clusterEndTime_snap',
										name :'cluster.clusterEndTime_snap',
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
					id : "clusterSnapRadiogroup",
					columns : 3,
					items : [{
								boxLabel :local.backup.snapStrategyMost,
								name :'cluster.clusterKeepSnapType',
								id :'clusterAstrictpartRadio',
								width : 160,
								height : 35,
								checked:true,
								inputValue : 1
							}, {
								xtype : 'numberfield',
								hideTrigger : true,//隐藏微调按钮
								allowDecimals : false, // 不允许输入小数
								nanText : local.recovery.tipNumM,
								id : 'clusterMaxSnapSet',
								name : 'cluster.clusterMaxSnapSet',
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
								name : "cluster.clusterKeepSnapType",
								id :'clusterAstrictdayRadio',
								inputValue : 2
							}, {
								xtype : 'numberfield',
								hideTrigger : true,//隐藏微调按钮
								allowDecimals : false, // 不允许输入小数
								nanText : local.recovery.tipNumM,
								id : 'clusterSnapPersistDay',
								name : 'cluster.clusterSnapPersistDay',
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
								var value = newValue["cluster.clusterKeepSnapType"];
								if(1 == value){
									Ext.getCmp("clusterMaxSnapSet").enable();
									Ext.getCmp("clusterSnapPersistDay").disable();
								}else{
									Ext.getCmp("clusterMaxSnapSet").disable();
									Ext.getCmp("clusterSnapPersistDay").enable();
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
					id : 'clusterDataSize',
					name : 'cluster.clusterDataSize',
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
	}, /*{
		title : local.backup.particalesSaveConfig,
		xtype : "fieldset",
		height : 60,
		bodyPadding : 5,
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
                        id        : 'clusterIsParticlesRadio1' ,
                       name : 'cluster.clusterIsParticlesData',
                        inputValue: 1 
                         
                    }, {  
                    	flex:4,
                        boxLabel  : local.disabled,  
                        id        : 'clusterIsParticlesRadio2', 
                       name : 'cluster.clusterIsParticlesData',
                        inputValue: 2,
                        checked : true
                    }  
                ],
                listeners : {
                	change :function(checkbox,newValue,oldValue,eOpts){
//                		alert(newValue.isParticlesData)
                	}
                }
            }]
	},*/ {
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
Ext.define("websure.backup.view.ClusterBackupConfig", {
	extend : 'Ext.window.Window',
	title : local.backup.clusterBackupConfig,
	draggable : false,
	height : 700,
	width : 900,
	closable : true,
	cls : 'config',
	id : 'clusterConfigWindow',
	layout : "border",    //窗口布局类型
	modal : true,    //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		clusterId = config.clusterId;
		var me = this;
		me.items = [{
					xtype : 'ClusterConfigTree',
					region : 'west',
					//height : 580,
					border : false,
					width : 150,
					listeners : {
						afterrender : function() {
							var record = this.getStore().getNodeById('cluster_backup_1');
							this.getSelectionModel().select(record);
						},
						itemclick : function(record, item, index, e, eOpts) {
							var ids = item.data.id;
							if ("cluster_backup_1" == ids) {
								Ext.getCmp("clusterConfigdatasoure").show();
								Ext.getCmp("clusterConfigStrategy").hide();
								Ext.getCmp("clusterSnapStrategy").hide();
								
								clusterCurrentPanel = 1;
								Ext.getCmp("clusterPreButton").disable();
								Ext.getCmp("clusterNextButton").enable();
							} else if ("cluster_backup_2" == ids) {
								Ext.getCmp("clusterConfigdatasoure").hide();
								Ext.getCmp("clusterConfigStrategy").show();
								Ext.getCmp("clusterSnapStrategy").hide();
								
								clusterCurrentPanel = 2;
								Ext.getCmp("clusterPreButton").enable();
								Ext.getCmp("clusterNextButton").enable();
							} else if ("cluster_backup_3" == ids) {
								Ext.getCmp("clusterConfigdatasoure").hide();
								Ext.getCmp("clusterConfigStrategy").hide();
								Ext.getCmp("clusterSnapStrategy").show();
								
								clusterCurrentPanel = 3;
								Ext.getCmp("clusterPreButton").enable();
								Ext.getCmp("clusterNextButton").disable();
							}
						}
					}
				}, {
					xtype : 'form',
					region : 'center',
					id : 'clusterConfigContentPanel',
					style : 'background:#fff;border-left:1px solid #d1dade;padding:20px;',
					border : false,
					items : [{
						xtype : 'ClusterConfigdatasoure',
						listeners : {
							'afterrender' : function() {
								
							}													
						}
					}, {
						xtype : 'ClusterConfigStrategy'
					}, {
						xtype : 'ClusterSnapStrategy'
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
								id : 'clusterPreButton',
								handler : function() {
									var tree = Ext.getCmp('clusterConfigTree');
									if (2 == clusterCurrentPanel) {
										Ext.getCmp("clusterConfigdatasoure").show();
										Ext.getCmp("clusterConfigStrategy").hide();
										Ext.getCmp("clusterSnapStrategy").hide();
										clusterCurrentPanel = 1;
										Ext.getCmp("clusterPreButton").disable();

										var record = tree.getStore().getNodeById('cluster_backup_1');
										tree.getSelectionModel().select(record);
									} else if (3 == clusterCurrentPanel) {
										Ext.getCmp("clusterConfigdatasoure").hide();
										Ext.getCmp("clusterConfigStrategy").show();
										Ext.getCmp("clusterSnapStrategy").hide();
										clusterCurrentPanel = 2;
										Ext.getCmp("clusterPreButton").enable();
										Ext.getCmp("clusterNextButton").enable();

										var record = tree.getStore().getNodeById('cluster_backup_2');
										tree.getSelectionModel().select(record);
									}
								}
							}, {
								xtype : 'button',
								id : 'clusterNextButton',
								text : local.btn.next,
								handler : function() {
									var tree = Ext.getCmp('clusterConfigTree');
									if (1 == clusterCurrentPanel) {
										Ext.getCmp("clusterConfigdatasoure").hide();
										Ext.getCmp("clusterConfigStrategy").show();
										Ext.getCmp("clusterSnapStrategy").hide();
										clusterCurrentPanel = 2;
										Ext.getCmp("clusterPreButton").enable();

										var record = tree.getStore().getNodeById('cluster_backup_2');
										tree.getSelectionModel().select(record);
									} else if (2 == clusterCurrentPanel) {
										Ext.getCmp("clusterConfigdatasoure").hide();
										Ext.getCmp("clusterConfigStrategy").hide();
										Ext.getCmp("clusterSnapStrategy").show();
										clusterCurrentPanel = 3;
										Ext.getCmp("clusterPreButton").enable();
										Ext.getCmp("clusterNextButton").disable();

										var record = tree.getStore().getNodeById('cluster_backup_3');
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
									var selectNodes = Ext.getCmp('clusterDeviceHardTree').getChecked();
									
									if(selectNodes==''){
									    Ext.MessageBox.alert(local.window.tip,local.backup.chooseDataSource);
										return;
									}
									
									// 检查共享磁盘有没有勾选，未勾选不允许保存 
									var clusterDiskCount = 0;	// 记录勾选的共享磁盘数量
									Ext.Array.each(selectNodes, function(item){
										var clusterType = item.raw.clusterType;
										if(clusterType) {
											clusterDiskCount++;
										}
							        });
									
									if(clusterDiskCount <= 0){
									    Ext.MessageBox.alert(local.window.tip, local.backup.shareDiskLimit);
										return;
									}
									
									//获取存储目标位置
//									var targetPath = Ext.getCmp('');
									if(STORAGESYMBOL_Config == null || STORAGESYMBOL_Config == "") {
										 Ext.MessageBox.alert(local.window.tip,local.backup.chooseStoragePosition);
										return false;
									}
									
									//获取同步策略设置值
									var clusterSyntimeCycleSwitch_page = Ext.getCmp('clusterSyntimeCycleSwitch').getValue()
									var clusterSyntimeCycleValue_page = Ext.getCmp('clusterSyntimeCycleValue').getValue();
									var clusterSyntimeCycleType_page = Ext.getCmp('clusterSyntimeCycleType').getValue();
									
									if(clusterSyntimeCycleSwitch_page){
										if(clusterSyntimeCycleValue_page <= 0) {
											Ext.MessageBox.alert(local.window.tip,local.backup.minSynTime);
											return false;
										}
										
										if(clusterSyntimeCycleType_page == 0) {//秒
											if(clusterSyntimeCycleValue_page > 600) {
												Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime_miao);
												return false;
											}
										}else if(clusterSyntimeCycleType_page == 1) {//分
											if(clusterSyntimeCycleValue_page > 600) {
												Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime_fen);
												return false;
											}
										}else if(clusterSyntimeCycleType_page == 2) {//时
											if(clusterSyntimeCycleValue_page > 600) {
												Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime_shi);
												return false;
											}
										}else if(clusterSyntimeCycleType_page == 3) {//天
											if(clusterSyntimeCycleValue_page > 31) {
												Ext.MessageBox.alert(local.window.tip,local.backup.maxSynTime);
												return false;
											}
										}
									}
									
									//获取同步时间段限制
									var clusterSyntimeRangeSwitch_page = Ext.getCmp('clusterSyntimeRangeSwitch').getValue();
									if(1 == clusterSyntimeRangeSwitch_page){
										var start_Time = Ext.getCmp("clusterStartTime_Syn").getValue();
										var end_Time = Ext.getCmp("clusterEndTime_Syn").getValue();
										if(null == start_Time){
											Ext.MessageBox.alert(local.window.tip,local.backup.synPauseStartTimeNoNull);
											return false;
										}
										
										if(null == end_Time){
											Ext.MessageBox.alert(local.window.tip,local.backup.synPauseEndTimeNoNull);
											return false;
										}
									}
									
									//获取备份速度限制
									var clusterLimiteSwitch_page = Ext.getCmp('clusterLimiteSwitch').getValue();
									if(clusterLimiteSwitch_page){
										var limitedBackupSpeedKB = Ext.getCmp('clusterLimiteValue').getValue();
										if(limitedBackupSpeedKB<1024){
											Ext.MessageBox.alert(local.window.tip,local.backup.minBackupSpeedLimit);
										    return false;
										}else if(limitedBackupSpeedKB>61200){
											Ext.MessageBox.alert(local.window.tip,local.backup.maxBackupSpeedLimit);
										    return false;
										}
									}
									
									//获取快照间隔时间值
                                    var clusterSnapCycleValue_page = Ext.getCmp('clusterSnapCycleValue').getValue();
                                    var clusterSnapCycleType_page = Ext.getCmp('clusterSnapCycleType').getValue();//获取间隔单位
                                    
                                    if(null == clusterSnapCycleValue_page){
                                        Ext.MessageBox.alert(local.window.tip,local.backup.minSnapTimeNoNull);
                                        return false;
                                    }
                                    
                                    if(clusterSnapCycleValue_page <= 0) {
                                    	Ext.MessageBox.alert(local.window.tip,local.backup.minSnapTime);
                                   	    return false;
                                    }
                                    
                                    if(clusterSnapCycleType_page == 2) { //小时   
                                        if(clusterSnapCycleValue_page > 720) {
                                            Ext.MessageBox.alert(local.window.tip,local.backup.maxSnapTime_shi);
                                            return false;
                                        }
                                    }else if(clusterSnapCycleType_page == 3) { //天 
                                        if(clusterSnapCycleValue_page > 31) {
                                            Ext.MessageBox.alert(local.window.tip,local.backup.maxSnapTime);
                                            return false;
                                        }
                                    }
                                    
                                    //获取快照时间段限制
									var clusterSnapRangeSwitch_page = Ext.getCmp('clusterSnapRangeSwitch').getValue();
									if(1 == clusterSnapRangeSwitch_page){
										var clusterStartTime_snap_page = Ext.getCmp("clusterStartTime_snap").getValue();
										var clusterEndTime_snap = Ext.getCmp("clusterEndTime_snap").getValue();
										if(null == clusterStartTime_snap_page){
											Ext.MessageBox.alert(local.window.tip,local.backup.snapPauseStartTimeNoNull);
											return false;
										}
										
										if(null == clusterEndTime_snap){
											Ext.MessageBox.alert(local.window.tip,local.backup.snapPauseEndTimeNoNull);
											return false;
										}
										
										//去除快照时间段的开始时间和结束时间的比较
										/*if(start_Time_snap >= end_Time_snap){
											Ext.MessageBox.alert(local.window.tip,local.backup.snapPauseStartGtEndTime);
											return false;
										}*/
									}
                                        
									
									//获取快照保留天数
									var snapRadiogroup = Ext.getCmp('clusterSnapRadiogroup').getChecked();
									if(1 == snapRadiogroup[0].inputValue){
										var nKeepSnapNum = Ext.getCmp('clusterMaxSnapSet').getValue();
										if(nKeepSnapNum < 2) {
											Ext.MessageBox.alert(local.window.tip,local.backup.minSnapNum);
											return false;
										}
										if(-1 != clusterSnapNum){
											if(nKeepSnapNum > clusterSnapNum) {
												Ext.MessageBox.alert(local.window.tip,local.backup.authSnapMaxNum1+clusterSnapNum+local.backup.authSnapMaxNum2); 
												return false;
											}
										}else{//授权为无限制
											if(nKeepSnapNum > 256) {
												Ext.MessageBox.alert(local.window.tip,local.backup.snapStrategyMostLessThan256); 
												return false;
											}
										}
										
									}else{
										var nSynchrdaySize = Ext.getCmp('clusterSnapPersistDay').getValue();
										if(!(nSynchrdaySize>=1&&nSynchrdaySize<=365)){
											Ext.MessageBox.alert(local.window.tip,local.backup.rangeSnapNum);
											return false;
										}
									}
									
									//获取完整数据集
										var snapFull = Ext.getCmp('clusterDataSize').getValue();
										
										if(-1 != clusterDataSetNum){
											if(snapFull > clusterDataSetNum) {
												Ext.MessageBox.alert(local.window.tip,local.backup.authDateMaxNum1+clusterDataSetNum+local.backup.authDateMaxNum2); 
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
									//--------------------------------
										var arrForHardDiskIds_add = [];
										var arrForHardDiskIds_remove = [];
										
										var arrForPartitionIds_add = [];
										var  arrForPartitionIds_remove= [];
										
										var arrForVolumenIds_add = [];
										var arrForVolumenIds_remove = [];
									//---------------------------------
									//获取选择分区ID
									var arrForPartitionIds_new = [];
									var arrForVolumenIds_new = [];
									var arrForHardDiskIds_new = [];
							        Ext.Array.each(selectNodes, function(item){
										 	if(1 == item.raw.isHardDisk){//磁盘
							        			arrForHardDiskIds_new.push(item.raw.hardDiskId);
										 	}else{//分区
										 		 if(1 == item.raw.hardType){//普通
							        			 	arrForPartitionIds_new.push(item.raw.partitionId);
										         }else if(2 == item.raw.hardType){//LVM
										        	 arrForVolumenIds_new.push(item.raw.partitionId);
										         }
										 	}
							        });
							        console.log("new--"+arrForHardDiskIds_new);
							        console.log("new--"+arrForPartitionIds_new);
							        console.log("new--"+arrForVolumenIds_new);
							        //------------------------比较new和old的不同的地方--------------------------
							        /**
							         * hardDiskIds_old   partitionIds_old   volumeIds_old
							         * 
							         * arrForHardDiskIds_new   arrForPartitionIds_new   arrForVolumenIds_new   
							         */
							        //-----------------------------------------------------------------------------
							         Ext.Array.each(hardDiskIds_old, function(item_old){
							         	 var flag = false;
										 Ext.Array.each(arrForHardDiskIds_new, function(item_new){
										 	if(item_new == item_old){
										 		flag = true;
										 		return false;
										 	}
							        	 });
							        	 if(!flag){
							        	 	arrForHardDiskIds_remove.push(item_old);
							        	 }
							        });
							        Ext.Array.each(arrForHardDiskIds_new, function(item_new){
							         	 var flag = false;
										 Ext.Array.each(hardDiskIds_old, function(item_old){
										 	console.log("old="+item_old+"new="+item_new)
										 	if(item_new == item_old){
										 		flag = true;
										 		return false;
										 	}
							        	 });
							        	 if(!flag){
							        	 	arrForHardDiskIds_add.push(item_new);
							        	 }
							        });
							        //-----------------------------------------------------------------------------
							        console.log("hard_remove-"+arrForHardDiskIds_remove);
							        console.log("hard_add-"+arrForHardDiskIds_add);
							        
							        //-----------------------------------------------------------------------------
							         Ext.Array.each(partitionIds_old, function(item_old){
							         	 var flag = false;
										 Ext.Array.each(arrForPartitionIds_new, function(item_new){
										 	if(item_new == item_old){
										 		flag = true;
										 		return false;
										 	}
							        	 });
							        	 if(!flag){
							        	 	arrForPartitionIds_remove.push(item_old);
							        	 }
							        });
							        Ext.Array.each(arrForPartitionIds_new, function(item_new){
							         	 var flag = false;
										 Ext.Array.each(partitionIds_old, function(item_old){
										 	if(item_new == item_old){
										 		flag = true;
										 		return false;
										 	}
							        	 });
							        	 if(!flag){
							        	 	arrForPartitionIds_add.push(item_new);
							        	 }
							        });
							        //-----------------------------------------------------------------------------
							        console.log("partitin_remove-"+arrForPartitionIds_remove);
							        console.log("partition_add-"+arrForPartitionIds_add);
							        
							         //-----------------------------------------------------------------------------
							         Ext.Array.each(volumeIds_old, function(item_old){
							         	 var flag = false;
										 Ext.Array.each(arrForVolumenIds_new, function(item_new){
										 	if(item_new == item_old){
										 		flag = true;
										 		return false;
										 	}
							        	 });
							        	 if(!flag){
							        	 	arrForVolumenIds_remove.push(item_old);
							        	 }
							        });
							        Ext.Array.each(arrForVolumenIds_new, function(item_new){
							         	 var flag = false;
										 Ext.Array.each(volumeIds_old, function(item_old){
										 	if(item_new == item_old){
										 		flag = true;
										 		return false;
										 	}
							        	 });
							        	 if(!flag){
							        	 	arrForVolumenIds_add.push(item_new);
							        	 }
							        });
							        //-----------------------------------------------------------------------------
							        console.log("volume_remove-"+arrForVolumenIds_remove);
							        console.log("volume_add-"+arrForVolumenIds_add);
									var loadMarsk_config = new Ext.LoadMask(Ext.getCmp("clusterConfigWindow"), {
														msg : local.backup.configSavingMsg,
														removeMask : true// 完成后移除
														});
										loadMarsk_config.show(); //显示
										var load_config =new Ext.util.DelayedTask(function(){  
										               loadMarsk_config.hide()
										            });  
									Ext.getCmp('clusterConfigContentPanel').getForm().submit({
										url : '/backup/toclusterAction!saveClusterConfig.action',
										params: {
										 hardDiskNodes_add: arrForHardDiskIds_add,
										 hardDiskNodes_remove: arrForHardDiskIds_remove,
									     partitionNodes_add: arrForPartitionIds_add,
									     partitionNodes_remove: arrForPartitionIds_remove,
									     volumeNodes_add:arrForVolumenIds_add,
									     volumeNodes_remove:arrForVolumenIds_remove,
									     storageSymbol:STORAGESYMBOL_Config,
									     storagePath : PATH_Config,
									     clusterId : clusterId
									    },
									    timeout: 10000, 
										success : function(form, action) {
//											var obj = JSON.parse(action.result.msg);
											var obj = action.result; //吧字符串变为json格式
											var code = obj.msgCode;
											var content = obj.msgContent;
											if(MSG_NORMAL==code){
												Ext.websure.MsgTip.msg(local.window.tip, content, true);
												
												Ext.getCmp('clusterConfigWindow').destroy();
												clusterState = 2;//cluster状态为暂停状态
												stopStateClu();
												
												Ext.getCmp("clusterBackupconfig").setDisabled(false);
												Ext.getCmp("clusterbaseConfig").setDisabled(true);
												
												Ext.getCmp("clusterViewShareDiskTree").store.reload();
												
												if(2 == Ext.getCmp("clusterDetailtabPanel").activeTab.itemId){
													// 备份策略详情
													Ext.getCmp("clusterBackupStrategy").store.load({
														params : {
															clusterId : clusterId
														}
													});
												}
													
											}else{
												Ext.websure.MsgError(code, content);
												Ext.getCmp('clusterConfigWindow').destroy();
												Ext.getCmp("clusterViewShareDiskTree").store.reload();
												
												if(2 == Ext.getCmp("clusterDetailtabPanel").activeTab.itemId){
													// 备份策略详情
													Ext.getCmp("clusterBackupStrategy").store.load({
														params : {
															clusterId : clusterId
														}
													});
												}
											}
											
										},
										failure : function() {
//											Ext.MessageBox.alert(local.window.tip,local.backup.modifyFailure);
											Ext.websure.MsgError("WF-30009",local.backup.modifyFailure);
											
											Ext.getCmp('configWindow').destroy();
										}
									});
									clusterCurrentPanel = 1;
								}
							},{
								xtype : 'button',
								text : local.btn.cancle,
								id : 'cancelButton',
								handler : function() {
									clusterCurrentPanel = 1;
									Ext.getCmp('clusterConfigWindow').destroy();
								}
							} ]

				}];
		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
			console.info(Ext.getCmp("clusterConfigStrategy"))
			Ext.getCmp("clusterConfigStrategy").hide();
			Ext.getCmp("clusterSnapStrategy").hide();
			if (1 == clusterCurrentPanel) {
				Ext.getCmp("clusterPreButton").disable();
			}
		
		//获取授权信息
		Ext.Ajax.request({
			url : '/backup/tobackupAction!getSnapAndDataSetLicense.action',
			
			success : function(response, options) {
				var obj = Ext.decode(response.responseText);
				clusterSnapNum = obj.snapNum;
				clusterDataSetNum = obj.dataSetNum;
				disabledCheckboxShare();
				disabledCheckboxDevice();
				disabledCheckboxFormat();
				clusterAddMoreText();
			},
			failure : function() {
				Ext.websure.MsgError("WF-30010",local.backup.getAuthInfoFailure);
			}
		})
		
		//填充数据
		Ext.Ajax.request({
						url : '/backup/toclusterAction!getClusterInfoByClusterId.action',
						params : {
							clusterId : clusterId
						},
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							clusterState = obj.detail.clusterState;
							//设置clusterd
							Ext.getCmp("clusterId").setValue(obj.detail.clusterId);
							//设置deviceId
							Ext.getCmp("clusterType").setValue(obj.detail.clusterType);
							//设置isNew
							if(4 == obj.detail.clusterState){//集群当前状态时未配置
								Ext.getCmp("clusterOpration").setValue(0);
							}else{
								Ext.getCmp("clusterOpration").setValue(1);
								$("#clusterStoragePathTreeConfig").find("input[role='checkbox']").attr("disabled",true);
							}
							
							
							//启用同步策略设置
							if(1 == obj.detail.clusterSyntimeCycleSwitch){
								Ext.getCmp("clusterSyntimeCycleSwitch").setValue(obj.detail.clusterSyntimeCycleSwitch);
								Ext.getCmp("clusterSyntimeCycleValue").setValue(obj.detail.clusterSyntimeCycleValue);
								Ext.getCmp("clusterSyntimeCycleType").setValue(obj.detail.clusterSyntimeCycleType);
							}
							
							//备份速度限制
							if(1 == obj.detail.clusterLimiteSwitch){
								Ext.getCmp("clusterLimiteSwitch").setValue(1);
								Ext.getCmp("clusterLimiteValue").setValue(obj.detail.clusterLimiteValue);
							}
							
							//同步时间段限制
							if(1 == obj.detail.clusterSyntimeRangeSwitch){
								Ext.getCmp("clusterSyntimeRangeSwitch").setValue(1);
								var arrForCom = obj.detail.clusterSyntimeRangeValue.split(";");
								Ext.getCmp("clusterStartTime_Syn").setValue(arrForCom[0]);
								Ext.getCmp("clusterEndTime_Syn").setValue(arrForCom[1]);
							}
							
							//快照时间段限制
							if(1 == obj.detail.clusterSnapRangeSwitch){
								Ext.getCmp("clusterSnapRangeSwitch").setValue(1);
								var arrForCom = obj.detail.clusterSnapRangeValue.split(";");
								Ext.getCmp("clusterStartTime_snap").setValue(arrForCom[0]);
								Ext.getCmp("clusterEndTime_snap").setValue(arrForCom[1]);
							}
							
						   //快照周期设置
							if(0 != obj.detail.clusterSnapCycleValue){
								Ext.getCmp("clusterSnapCycleValue").setValue(obj.detail.clusterSnapCycleValue);
								Ext.getCmp("clusterSnapCycleType").setValue(obj.detail.clusterSnapCycleType);
							}
								
								
						   //快照保存策略
								//选中radio
								if(1 == obj.detail.clusterKeepSnapType){
									Ext.getCmp("clusterAstrictpartRadio").setValue(true);
									if(0 != obj.detail.keepsnapNum){
										Ext.getCmp("clusterMaxSnapSet").setValue(obj.detail.clusterMaxSnapSet);
									}
								}else if(2 == obj.detail.clusterKeepSnapType){
									Ext.getCmp("clusterAstrictdayRadio").setValue(true);
									if(0 != obj.detail.keepsnapEnable){
										Ext.getCmp("clusterSnapPersistDay").setValue(obj.detail.clusterSnapPersistDay);
									}
								}else{
									Ext.getCmp("clusterAstrictpartRadio").setValue(true);
									if(0 != obj.detail.keepsnapNum){
										Ext.getCmp("clusterMaxSnapSet").setValue(64);
									}
								}
							
							//完整保留策略设置
								if(0 != obj.detail.clusterDataSize){
									Ext.getCmp("clusterDataSize").setValue(obj.detail.clusterDataSize);
								}

							//颗粒存储策略
								var radio1 = Ext.getCmp("clusterIsParticlesRadio1");
								var radio2 = Ext.getCmp("clusterIsParticlesRadio2");
								if(1 == obj.detail.clusterIsParticlesData){
									radio1 && radio1.setValue(true);
								}else{
									radio2 && radio2.setValue(true);
								}
								
						},
						failure : function() {
							Ext.websure.MsgError("WF-30010",local.backup.findClusterConfigDataFailure);
						}
					});
		
		},
		'close' : function(){
      		clusterCurrentPanel = 1;
			Ext.getCmp('clusterConfigWindow').destroy();
  		}
	}
});

function clusterSetChildDiskChecked(node, checked) {
	var cou = 0;
	node.expand();
	console.log("node has child:"+node.hasChildNodes());
	node.set('checked', checked);
	if (node.hasChildNodes()) {
		node.eachChild(function(item) {
			if('2' != item.data.partitionStandbyModel){		
				clusterSetChildDiskChecked(item, checked);
			}else{
				item.set('checked', !checked);
				cou++;
			}
		});
		
		if(cou>0){
			node.set('checked', !checked);
		}
	}else if(node.data.hardName !=""){//磁盘下没有分区不让选择
		node.set('checked', false);
	}
}
//根据子节点选中父节点
function clusterSetParentDiskChecked(node, checked) {
	if (node.parentNode.parentNode.id.split("-")[1] != 'root') {
		 if(checked){
			 if(!node.parentNode.findChild('checked',false)){    
					node.parentNode.set('checked', true);  
			    }
			 /*if(!node.parentNode.checked){
	                node.parentNode.set('checked', checked);  
	            }*/
		 }else{
			    //如果父节点没有被选中的子节点，则设为非选中状态
			    //if(!node.parentNode.findChild('checked',true)){    
					node.parentNode.set('checked', false);  
			    //}
		 }
	}
}
//添加悬浮信息，显示全部内容
function clusterAddMoreText(){
	var moreInfoTitle=$("#clusterConfigContentPanel .x-tree-node-text ");
	moreInfoTitle.each(function(){
		$(this).attr("title",$(this).text());
	})
}
//选中子节点 TODO
function selChild(node, checked) {
	node.eachChild(function(child) {
		var isDisabled = $("tr[data-recordid="+child.id.slice(42)+"]").find("td:first div.x-grid-cell-inner input").attr("disabled");
		
		var thisValue=node.get("clusterType");
		if(isDisabled !== "disabled" || thisValue==1){
			child.set("checked" , true);
		}
	});
}
//取消选中子节点
function dSelChild(node, checked) {
	node.eachChild(function(child) {
		child.set("checked" , false);
	});
}
//共享数据的子节点禁用复选框
function disabledCheckboxDevice(){
	var gridTr=$("#clusterShareDiskTree-body table tr.x-grid-tree-node-leaf");
	gridTr.each(function(){
		$(this).find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
	});
}
//是否为共享磁盘，是则禁用复选框
function disabledCheckboxShare(){
	var devTree = Ext.getCmp("clusterDeviceHardTree").getStore().getRootNode().childNodes;
	for(i=0;i<devTree.length;i++){
		var childNodes=devTree[i].childNodes;    //二级子节点
		for(j=0;j<childNodes.length;j++){
			    var node=childNodes[j];
				var thisValue=node.get("clusterType");
				if(thisValue==1){
						var id=node.id.slice(42);
						$("tr[data-recordid="+id+"]").find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
						if(node.hasChildNodes( )){      //如果有子节点，则禁用子节点
							var nodeC = childNodes[j].childNodes;    //三级子节点
							var length = nodeC.length;
							for(k=0;k<length;k++){
								var thisNodeId=nodeC[k];
								var thisId=thisNodeId.id.slice(42);
								$("tr[data-recordid="+thisId+"]").find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
							}
						}
			  }
		}
	}
}
//分区格式是否为LVM_member，是则禁用复选框
function disabledCheckboxFormat(){
	var format = "LVM2_member";
	var devTree = Ext.getCmp("clusterDeviceHardTree").getStore().getRootNode().childNodes;
	for(i=0;i<devTree.length;i++){
		var childNodes=devTree[i].childNodes;    //二级子节点
		for(j=0;j<childNodes.length;j++){
			var nodes=childNodes[j];
			if(nodes.hasChildNodes( )){
				var node = childNodes[j].childNodes;    //三级子节点
				var length = node.length;
				var n=0;
				for(k=0;k<length;k++){
					var thisNode=node[k];
					var thisValue=thisNode.get("fileSystem");
					if(thisValue==format){
						n++;
						var id=thisNode.id.slice(42);
						$("tr[data-recordid="+id+"]").find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
						var id2=nodes.id.slice(42);
						$("tr[data-recordid="+id2+"]").find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
					}
				}
				//if(n==length){
//					var id=nodes.id.slice(42);
//					$("tr[data-recordid="+id+"]").find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
//					thisNode.disable();
				//}
			}
		}
	}
}
//选中共享磁盘中的数据，下面的磁盘同步选择
function chooseSameDisk(node, checked){
	node.eachChild(function(child) {
		var id=child.get('hardDiskId');    //选中的磁盘id
		var devTree = Ext.getCmp("clusterDeviceHardTree").getStore().getRootNode().childNodes;    //获取下面磁盘的第一级子节点
		for(i=0;i<devTree.length;i++){
			var childNodes=devTree[i].childNodes;    //二级子节点
			for(j=0;j<childNodes.length;j++){
				var nodes=childNodes[j];
				var harddiskid=nodes.get("hardDiskId");
				if(harddiskid==id){
					nodes.set("checked" , true);
					selChild(nodes,checked);    //选中子节点
				}
			}
		}
	});
	disabledCheckboxShare();
	disabledCheckboxFormat();
}
//取消选中共享磁盘中的数据，下面的磁盘同步选择
function cancleChooseSameDisk(node, checked){
	node.eachChild(function(child) {
		var id=child.get('hardDiskId');    //选中的磁盘id
		var devTree = Ext.getCmp("clusterDeviceHardTree").getStore().getRootNode().childNodes;    //获取下面磁盘的第一级子节点
		for(i=0;i<devTree.length;i++){
			var childNodes=devTree[i].childNodes;    //二级子节点
			for(j=0;j<childNodes.length;j++){
				var nodes=childNodes[j];
				var harddiskid=nodes.get("hardDiskId");
				if(harddiskid==id){
					nodes.set("checked" , false);
					dSelChild(nodes,checked);    //取消选中子节点
				}
			}
		}
	});
	disabledCheckboxShare();
	disabledCheckboxFormat();
}

