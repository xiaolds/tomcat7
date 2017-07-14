/*
 * 显示需要做双机的数据
 */
Ext.define('websure.backup.view.SelectDualComputerList', {
			extend : 'Ext.grid.GridPanel',
			id : 'selectDualComputerList',
			alias : 'widget.selectDualComputerList',
			store : 'DualComputerStore',
			border:false,
			viewConfig : {
				stripeRows : false,    // 在表格中显示斑马线
				enableTextSelection : true    // 可以复制单元格文字
			},
			selModel : {
				injectCheckbox : 0,
				mode : "SINGLE",     //"SINGLE"/"SIMPLE"/"MULTI"
				checkOnly : true    //只能通过checkbox选择
			},
			selType : "checkboxmodel",
			enableColumnHide:false,
			enableColumnMove:false,
			columns : [{
						header : local.pcName,
						dataIndex : 'computerName',
						flex:1.5
					}, {
						header : local.backup.devSys,
						dataIndex : 'clientSysversion',
						flex : 1.2,
						hidden:true
					}, {
						header : local.device+"IP",
						dataIndex : 'ip',
						flex : 1
					}],
			width : '100%',
			loadMask : {
				msg : "local.backup.doublePcLoadMsg"
			},
			listeners : {
				selectionchange : function(sm, selections) {
					if ("" != selections) {
						var selectDeviceId = selections[0].data.deviceId;
						Ext.getCmp("selectSharedDiskList").store.load({
									params : {
										deviceId : selectDeviceId
									}, 
								callback: function(records, options, success){ 
									 if(success){
									 	var gridTr=$("#selectSharedDiskList-body table tr");
										gridTr.each(function(){
											var format=$(this).find("td:last div.x-grid-cell-inner").text();
											if(format=="LVM2_member"){
												$(this).find("td:first div.x-grid-cell-inner input").attr("disabled","disabled");
												$(this).find("td:first div.x-grid-cell-inner input").css("opacity","0.5");
											}
										})
									 }
						         }
								});
						Ext.getCmp("selectDevice")
								.setValue(selections[0].data.computerName);
						Ext.getCmp("selectDeviceId")
								.setValue(selections[0].data.deviceId);		
								
					}
				}
			}
		});

//显示需要做共享磁盘的数据
Ext.define('websure.backup.view.SelectSharedDiskList', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.selectSharedDiskList',
			id : 'selectSharedDiskList',
			width : '100%',
			useArrows : true,
			rootVisible : false,
			store : "SelectSharedDiskStore",
			multiSelect : true,
			enableColumnHide:false,
			enableColumnMove:false,
			loadMask : {
				msg : local.backup.shareDiskLoadMsg
			},
			//        singleExpand: true,  
			columns : [{
						xtype : 'treecolumn',
						text : local.disk,
						flex : 2.5,
						sortable : true,
						tdCls:"font_bold",
						dataIndex : 'hard_partition_Name'
					},{
						xtype : 'treecolumn',
						text : local.disk,
						flex : 1,
						sortable : true,
						dataIndex : 'hardName',
						hidden : true
					}, {
						xtype : 'column',
						text : local.disk+'ID',
						flex : 1,
						sortable : true,
						dataIndex : 'hardDiskId',
						hidden : true
					},{
						xtype : 'column',
						text : local.partition+'ID',
						flex : 1,
						sortable : true,
						dataIndex : 'partitionId',
						hidden : true
					},{
						xtype : 'templatecolumn',
						text : local.backup.diskInfoGridPartionColumn,
						flex : 1,
						dataIndex : 'letter',
						tpl : Ext.create('Ext.XTemplate','{letter:this.formatSize}', {
									formatSize : function(v) {
										var subs = v.replace(":", local.backup.diskInfoGridPartionColumnText)
										return subs;
									}
								}),
						hidden : true
					}, {
						//xtype : 'numbercolumn',
						text : local.backup.diskInfoGridSize,
						flex : 1,
						sortable : true,
						dataIndex : 'totalSector',
						align : 'center'
					}, {
						text : local.backup.diskInfoGridFormat,
						flex : 1,
						dataIndex : 'fileSystem'
					}],
					/*listeners:{
				        afterrender:function(){
				          var record = this.getStore().getNodeById('select');
				            this.getSelectionModel().select(record)
				        }
				    }*/
			listeners : {
				"checkchange" : function(node, checked) {
					checkboxSelected(node, checked);
					if(node.hasChildNodes()){
						node.eachChild(function(item,index) {
							if("LVM2_member" == item.data.fileSystem){
								item.set('checked', false);
							}
						});
						var gridTr=$("#selectSharedDiskList-body table tr");
						gridTr.each(function(){
							var format=$(this).find("td:last div.x-grid-cell-inner").text();
							if(format=="LVM2_member"){
								$(this).find("td:first div.x-grid-cell-inner input").attr("disabled","disabled");
								$(this).find("td:first div.x-grid-cell-inner input").css("opacity","0.5");
							}
						});
					}
				}
			}
		});

/*Ext.define("websure.backup.view.ChangeImg",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.changeImg',
	border:false,
	id : 'ynImg',
	items : [{
		id:"imgChan",
		border:false,
		html:"<div><img style='width:70px' src='/images/backup/off2.png' onclick=showOtherImg(1)></img></div>"
	}]
	
});*/

Ext.define("websure.backup.view.ChangeButt", {
			extend : "Ext.Button",
			scale : 'Large',
			alias : 'widget.changeButt',
			icon : '',
			iconAlign : 'left',
			id : 'ynButton',
			tag : 'N',
			handler : function(button) {
				var deviceId = Ext.getCmp("currentDeviceId").getValue();
				if (button.tag == 'N') {//显示匹配系统设备
					button.tag = 'Y';
					Ext.getCmp("selectDualComputerList").store.load({
								params : {
									deviceId : deviceId,
									type : 2
								}
							});
					Ext.getCmp("selectSharedDiskList").store.load({
								params : {
									deviceId : -1
								}  
							});
					Ext.getDom(button.getId()).innerHTML = local.backup.showAllDev;
				} else if (button.tag == 'Y') {//显示所有设备
					button.tag = 'N';
					Ext.getCmp("selectDualComputerList").store.load({
								params : {
									deviceId : deviceId,
									type : 1
								}
							});
//					var index = Ext.getCmp("selectDualComputerList").store.find('deviceId',deviceId);  
//					Ext.getCmp("selectDualComputerList").store.filterBy(function(record,id){}); 
					Ext.getCmp("selectSharedDiskList").store.load({
								params : {
									deviceId : -1
								}
							});
					Ext.getDom(button.getId()).innerHTML = local.backup.matchSysDev;
				}
			},
			listeners : {
				'afterrender' : function(button) {
					Ext.getDom(button.getId()).innerHTML = local.backup.matchSysDev;
				}
			}
		});

//双机配置模块
Ext.define('websure.backup.view.LeftPanel', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.leftPanel',
			id : 'leftPanel',
			layout :  'vbox',
			items : [{
						xtype : 'textfield',
						name : 'currentDevice',
						id : 'currentDevice',
						readOnly:true,
						fieldLabel : local.backup.currentDev
					}, {
						xtype : 'textfield',
						name : 'currentDeviceId',
						id : 'currentDeviceId',
						fieldLabel :local.backup.currentDev+ "ID",
						hidden : true
					}, {
						layout:'hbox',
						border:false,
						width:'100%',
						style:'margin-top:10px;margin-bottom:2px;',
						items:[{
						    	   xtype : 'label',
								   text : local.backup.chooseDoubleDev+':',
								   style:'display:block;height:30px;line-height:35px;'
						       },
						       {
						       	   xtype : 'label',
						    	   border:false,
						    	   flex:1,
						    	   style:'text-align:right;display:block;height:30px;line-height:30px;padding-right:6px',
						    	   html:local.backup.matchSys
						       },{
						       		xtype : 'panel',
						       		id:"imgChan",
						       		height:36,
						       		border:false,
						       		html:"<div><img style='width:70px' src='/images/backup/off2.png' onclick=showOtherImg(1)></img></div>"
						       
						       }]						
					},{
						xtype : "selectDualComputerList",
						width : '100%',
						//border : false,
						margin:"10 0 0 0",
						flex:1,
						style : 'border:1px solid #d1dade',
						//bodyBorder : false,
						listener : {}
					}]
		});

Ext.define('websure.backup.view.RightPanel', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.rightPanel',
			id : 'rightPanel',
			width : '100%',
			border : false,
			height : '100%',
			layout:"vbox",
			items : [{
						xtype : 'textfield',
						name : 'selectDevice',
						id : 'selectDevice',
						width:"100%",
						height:24,
						fieldLabel : local.backup.choosedDoubleDev,
						disabled : true
					},{
						xtype : 'textfield',
						name : 'selectDeviceId',
						id : 'selectDeviceId',
						fieldLabel : local.backup.choosedDoubleDev+'ID',
						hidden : true
					}, {
						xtype : 'label',
						text : local.backup.chooseshareDisk+':'
					}, {
						xtype : 'selectSharedDiskList',
						flex:1,
						width : '100%',
						border : false,
						margin:"10 0 0 0",
						style : 'border:1px solid #d1dade',
						listener : {}
					}]

		});

/*
 * 双机配置窗口
 */
Ext.define("websure.backup.view.DoubleComputerConfig", {
	extend : 'Ext.window.Window',
	title : local.backup.doublePcConfig, 		//标题
	draggable : false, 
	height : 600, 
	width : 900, 
	alias : 'widget.DoubleComputerConfig',
	id : 'DoubleComputerConfig',
	layout : "border", 		//窗口布局类型
	modal : true,		 //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		var me = this;
		me.items = [{
			xtype : 'leftPanel',
			region : 'west',
			height : 60,
			style : 'background:#fff;border-bottom:1px solid #d1dade;padding:20px;',
			border : false,
			width : 420,
			listeners : {
				afterrender : function() {
					Ext.getCmp("currentDevice").setValue(config.deviceName);
					Ext.getCmp("currentDeviceId").setValue(config.deviceId);
					//查询所有设备显示在左侧表格中
					Ext.getCmp("selectDualComputerList").store.load({
								params : {
									deviceId : config.deviceId
								}
							});

					//查询右侧表格中
					Ext.getCmp("selectSharedDiskList").store.load({
								params : {
									deviceId : -1
								}
							});
				}
			}
		}, {
			xtype : 'rightPanel',
			region : 'center',
			id : 'standbyPanel',
			style : 'background:#fff;border-left:1px solid #d1dade;border-bottom:1px solid #d1dade;padding:20px;',
			border : false
		}, {
			xtype : 'panel',    //之前为rightPanel,删除了
			region : 'south',
			id : 'sureButton',
			height : 71,
			//width : 900,
			border : false,
			layout:'hbox',
			style:'background:#fafbfc;padding-top:20px',
			bodyStyle:"background:#fafbfc",
			items : [
			         {
			        	 flex:1,
			        	 border:false
			         },{
						xtype : 'button',
						id:'configDoubleDevice',
						style:'margin-right:10px',
						text : local.btn.save,
						cls:"btn_focus",
						align : 'center'
					},{
						xtype : 'button',
						text : local.btn.cancle,
						style:'margin-right:20px',
						align : 'center',
						handler : function() {
							Ext.getCmp('DoubleComputerConfig').destroy();
						}
					}]
		}];

		me.callParent(arguments);
	}
});

function checkboxSelected(node, checked) {
	setChildChecked(node, checked);
	setParentChecked(node, checked);
//	setOtherParentUnchecked(node, checked);
}

function setChildChecked(node, checked) {
	node.expand();
	node.set('checked', checked);
	if (node.hasChildNodes()) {
		node.eachChild(function(child) {
					setChildChecked(child, checked);
				});
	}
}

function setParentChecked(node, checked) {
	node.set({
				checked : checked
			});
	var parentNode = node.parentNode;
	if (parentNode != null) {
		var flag = false;
		parentNode.eachChild(function(childnode) {
					if (childnode.get('checked')) {
						flag = true;
					}
				});
		if (checked == false) {
			if (!flag) {
				setParentChecked(parentNode, checked);
			}
		} else {
			if (flag) {
				setParentChecked(parentNode, checked);
			}
		}
	}
}

function showOtherImg(type){
	var deviceId = Ext.getCmp("currentDeviceId").getValue();
	if(1 == type){
		Ext.getCmp("imgChan").update("<div><img style='width:70px' src='/images/backup/on2.png' onclick=showOtherImg(2)></img></div>");
		
		Ext.getCmp("selectDualComputerList").store.load({
								params : {
									deviceId : deviceId,
									type : 2
								}
							});
		Ext.getCmp("selectSharedDiskList").store.load({
					params : {
						deviceId : -1
					}
				});
	}else{
		Ext.getCmp("imgChan").update("<div><img style='width:70px' src='/images/backup/off2.png' onclick=showOtherImg(1)></img></div>");
		
		Ext.getCmp("selectDualComputerList").store.load({
								params : {
									deviceId : deviceId,
									type : 1
								}
							});
		Ext.getCmp("selectSharedDiskList").store.load({
					params : {
						deviceId : -1
					}
				});
	}
	
}